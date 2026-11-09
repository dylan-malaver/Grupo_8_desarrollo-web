// =========================================================
// CONTROLADOR de usuarios (con Sequelize / MySQL):
// registro, login, perfil (detalle), edición de perfil y logout
// =========================================================
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = require('../database/models');
const { toSession } = require('../utils/userMapper');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_DIR = path.join(__dirname, '..', 'public', 'img', 'users');
const INCLUDE_CATEGORY = [{ model: db.UserCategory, as: 'category' }];

// Borra la imagen que se acaba de subir (si el formulario falla)
function removeUploaded(file) {
    if (file && file.path) fs.unlink(file.path, () => {});
}

// Borra una foto de perfil guardada (path.basename evita rutas raras)
function removeAvatar(filename) {
    if (filename) fs.unlink(path.join(AVATAR_DIR, path.basename(filename)), () => {});
}

// Solo se aceptan redirecciones internas (evita ir a sitios externos)
function safeRedirect(url) {
    return typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')
        ? url
        : '/admin/productos';
}

const userController = {
    // ---------- REGISTRO ----------
    register(req, res) {
        res.render('users/register', { error: null, old: {} });
    },

    async registerSubmit(req, res, next) {
        try {
            const { fullname = '', email = '', phone = '', password = '', confirmPassword = '', terms } = req.body;

            const fail = (message) => {
                removeUploaded(req.file);
                return res.status(400).render('users/register', {
                    error: message,
                    old: { fullname, email, phone }
                });
            };

            const name = fullname.trim();
            const digits = phone.replace(/\D/g, '');

            if (name.length < 3) return fail('Escribe tu nombre completo (mínimo 3 letras).');
            if (!EMAIL_RE.test(email.trim())) return fail('Ingresa un correo válido.');
            if (digits.length < 10) return fail('Ingresa un número de teléfono válido.');
            if (password.length < 6) return fail('La contraseña debe tener mínimo 6 caracteres.');
            if (password !== confirmPassword) return fail('Las contraseñas no coinciden.');
            if (!terms) return fail('Debes aceptar los términos y la política de privacidad.');

            const cleanEmail = email.trim().toLowerCase();

            if (await db.User.findOne({ where: { email: cleanEmail } })) {
                return fail('Ya existe una cuenta con ese correo.');
            }

            const clientCategory = await db.UserCategory.findOne({ where: { name: 'cliente' } });

            if (!clientCategory) {
                removeUploaded(req.file);
                throw new Error('Falta la categoría "cliente" en la tabla user_categories (importa data.sql).');
            }

            const parts = name.split(/\s+/);

            await db.User.create({
                first_name: parts[0],
                last_name: parts.slice(1).join(' '),
                email: cleanEmail,
                phone: phone.trim(),
                password: bcrypt.hashSync(password, 10), // contraseña encriptada
                image: req.file ? req.file.filename : null,
                user_category_id: clientCategory.id
            });

            res.redirect('/login');
        } catch (error) {
            removeUploaded(req.file);
            next(error);
        }
    },

    // ---------- LOGIN ----------
    login(req, res) {
        res.render('users/login', {
            error: null,
            redirectTo: req.query.redirect || '/admin/productos'
        });
    },

    async loginSubmit(req, res, next) {
        try {
            const email = (req.body.email || '').trim().toLowerCase();
            const password = req.body.password || '';
            const redirectTo = safeRedirect(req.body.redirectTo);

            const user = await db.User.findOne({ where: { email }, include: INCLUDE_CATEGORY });

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).render('users/login', {
                    error: 'El correo o la contraseña no son correctos.',
                    redirectTo
                });
            }

            req.session.user = toSession(user);
            req.session.isAdmin = req.session.user.category === 'admin';

            // Recordarme: cookie firmada con el id del usuario (30 días)
            if (req.body.remember) {
                res.cookie('rememberUser', String(user.id), {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    httpOnly: true,
                    signed: true
                });
            }

            res.redirect(req.session.isAdmin ? redirectTo : '/perfil');
        } catch (error) {
            next(error);
        }
    },

    // ---------- PERFIL (detalle) ----------
    async profile(req, res, next) {
        try {
            const user = await db.User.findByPk(req.session.user.id, { include: INCLUDE_CATEGORY });

            if (!user) return req.session.destroy(() => res.redirect('/login'));

            res.render('users/profile', { user: toSession(user), ok: req.query.ok === '1' });
        } catch (error) {
            next(error);
        }
    },

    // ---------- EDITAR PERFIL ----------
    // GET /perfil/editar
    async edit(req, res, next) {
        try {
            const user = await db.User.findByPk(req.session.user.id, { include: INCLUDE_CATEGORY });

            if (!user) return req.session.destroy(() => res.redirect('/login'));

            res.render('users/profileEdit', { user: toSession(user), error: null, old: {} });
        } catch (error) {
            next(error);
        }
    },

    // PUT /perfil
    async update(req, res, next) {
        try {
            const user = await db.User.findByPk(req.session.user.id, { include: INCLUDE_CATEGORY });

            if (!user) {
                removeUploaded(req.file);
                return req.session.destroy(() => res.redirect('/login'));
            }

            const firstName = (req.body.first_name || '').trim();
            const lastName = (req.body.last_name || '').trim();
            const phone = (req.body.phone || '').trim();
            const currentPassword = req.body.currentPassword || '';
            const newPassword = req.body.newPassword || '';
            const confirmPassword = req.body.confirmPassword || '';

            const fail = (message) => {
                removeUploaded(req.file);
                return res.status(400).render('users/profileEdit', {
                    user: toSession(user),
                    error: message,
                    old: { first_name: firstName, last_name: lastName, phone }
                });
            };

            if (firstName.length < 2) return fail('El nombre debe tener mínimo 2 letras.');
            if (phone.replace(/\D/g, '').length < 10) return fail('Ingresa un número de teléfono válido.');

            const changes = { first_name: firstName, last_name: lastName, phone };

            // Cambiar la contraseña es opcional y exige la contraseña actual
            if (newPassword) {
                if (!bcrypt.compareSync(currentPassword, user.password)) {
                    return fail('La contraseña actual no es correcta.');
                }
                if (newPassword.length < 6) return fail('La nueva contraseña debe tener mínimo 6 caracteres.');
                if (newPassword !== confirmPassword) return fail('Las contraseñas nuevas no coinciden.');

                changes.password = bcrypt.hashSync(newPassword, 10);
            }

            const oldImage = user.image;
            if (req.file) changes.image = req.file.filename;

            await user.update(changes);

            // Si subió otra foto, borramos la anterior
            if (req.file) removeAvatar(oldImage);

            // Actualizamos la sesión para que el header muestre los datos nuevos
            req.session.user = toSession(user);

            res.redirect('/perfil?ok=1');
        } catch (error) {
            removeUploaded(req.file);
            next(error);
        }
    },

    // ---------- LOGOUT ----------
    logout(req, res) {
        req.session.destroy(() => {
            res.clearCookie('rememberUser');
            res.redirect('/');
        });
    }
};

module.exports = userController;
