// =========================================================
// CONTROLADOR de usuarios: registro, login, perfil y logout
// =========================================================
const fs = require('fs');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const adminUser = require('../config/adminUser');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Borra la imagen subida si el registro falla
function removeUploaded(file) {
    if (file && file.path) fs.unlink(file.path, () => {});
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

    registerSubmit(req, res) {
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
        if (User.findByEmail(email) || email.trim().toLowerCase() === adminUser.email.toLowerCase()) {
            return fail('Ya existe una cuenta con ese correo.');
        }

        const parts = name.split(/\s+/);

        User.create({
            firstName: parts[0],
            lastName: parts.slice(1).join(' '),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password: bcrypt.hashSync(password, 10), // contraseña encriptada
            category: 'cliente',
            image: req.file ? req.file.filename : null
        });

        res.redirect('/login');
    },

    // ---------- LOGIN ----------
    login(req, res) {
        res.render('users/login', {
            error: null,
            redirectTo: req.query.redirect || '/admin/productos'
        });
    },

    loginSubmit(req, res) {
        const email = (req.body.email || '').trim();
        const password = req.body.password || '';
        const redirectTo = safeRedirect(req.body.redirectTo);

        // 1) Usuarios registrados (users.json, contraseña con bcrypt)
        const user = User.findByEmail(email);
        if (user && user.password && bcrypt.compareSync(password, user.password)) {
            req.session.user = User.toSession(user);
            req.session.isAdmin = user.category === 'admin';

            // Recordarme: cookie firmada con el id del usuario (30 días)
            if (req.body.remember) {
                res.cookie('rememberUser', String(user.id), {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    httpOnly: true,
                    signed: true
                });
            }

            return res.redirect(req.session.isAdmin ? redirectTo : '/perfil');
        }

        // 2) Administrador provisional (config/adminUser.js)
        if (email === adminUser.email && password === adminUser.password) {
            req.session.user = {
                id: 0,
                firstName: 'Administrador',
                lastName: '',
                email,
                phone: '',
                category: 'admin',
                image: null
            };
            req.session.isAdmin = true;
            req.session.adminEmail = email;
            return res.redirect(redirectTo);
        }

        res.status(401).render('users/login', {
            error: 'El correo o la contraseña no son correctos.',
            redirectTo
        });
    },

    // ---------- PERFIL ----------
    profile(req, res) {
        res.render('users/profile');
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