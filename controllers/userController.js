// =========================================================
// CONTROLADOR de usuarios (con Sequelize / MySQL):
// registro, login, perfil (detalle), edición de perfil y logout.
// Las validaciones están en validations/userValidations.js (Express Validator).
// =========================================================
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = require('../database/models');
const { toSession } = require('../utils/userMapper');
const { getErrors } = require('../validations/helpers');

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
        res.render('users/register', { errors: {}, old: {} });
    },

    async registerSubmit(req, res, next) {
        try {
            const errors = getErrors(req);

            if (Object.keys(errors).length > 0) {
                removeUploaded(req.file);
                return res.status(400).render('users/register', {
                    errors,
                    old: { fullname: req.body.fullname, email: req.body.email, phone: req.body.phone }
                });
            }

            const clientCategory = await db.UserCategory.findOne({ where: { name: 'cliente' } });

            if (!clientCategory) {
                throw new Error('Falta la categoría "cliente" en la tabla user_categories (importa data.sql).');
            }

            const parts = req.body.fullname.trim().split(/\s+/);

            await db.User.create({
                first_name: parts[0],
                last_name: parts.slice(1).join(' '),
                email: req.body.email.trim().toLowerCase(),
                phone: req.body.phone.trim(),
                password: bcrypt.hashSync(req.body.password, 10), // contraseña encriptada
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
            errors: {},
            old: {},
            redirectTo: req.query.redirect || '/admin/productos'
        });
    },

    async loginSubmit(req, res, next) {
        try {
            const redirectTo = safeRedirect(req.body.redirectTo);
            const errors = getErrors(req);

            if (Object.keys(errors).length > 0) {
                return res.status(400).render('users/login', {
                    errors,
                    old: { email: req.body.email },
                    redirectTo
                });
            }

            // Los datos ya fueron validados: el correo existe y la contraseña coincide
            const user = await db.User.findOne({
                where: { email: req.body.email.trim().toLowerCase() },
                include: INCLUDE_CATEGORY
            });

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

            res.render('users/profileEdit', { user: toSession(user), errors: {}, old: {} });
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

            const errors = getErrors(req);

            if (Object.keys(errors).length > 0) {
                removeUploaded(req.file);
                return res.status(400).render('users/profileEdit', {
                    user: toSession(user),
                    errors,
                    old: {
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        phone: req.body.phone
                    }
                });
            }

            const changes = {
                first_name: req.body.first_name.trim(),
                last_name: (req.body.last_name || '').trim(),
                phone: req.body.phone.trim()
            };

            if (req.body.newPassword) changes.password = bcrypt.hashSync(req.body.newPassword, 10);

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
