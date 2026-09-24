// =========================================================
// CONTROLADOR de usuarios: login (con acceso de administrador) y registro
// =========================================================
const adminUser = require('../config/adminUser');

const userController = {
    // GET /login  ->  formulario de inicio de sesión
    login(req, res) {
        res.render('users/login', {
            error: null,
            redirectTo: req.query.redirect || '/admin/productos'
        });
    },

    // POST /login  ->  revisa el correo y la contraseña
    loginSubmit(req, res) {
        const email = (req.body.email || '').trim();
        const password = req.body.password || '';
        const redirectTo = req.body.redirectTo || '/admin/productos';

        // Por ahora solo existe el usuario administrador (ver config/adminUser.js).
        // Los clientes normales todavía no tienen cuenta real: eso llega con la base de datos.
        if (email === adminUser.email && password === adminUser.password) {
            req.session.isAdmin = true;
            req.session.adminEmail = email;
            return res.redirect(redirectTo);
        }

        res.status(401).render('users/login', {
            error: 'El correo o la contraseña no son correctos.',
            redirectTo
        });
    },

    // GET /logout  ->  cierra la sesión de administrador
    logout(req, res) {
        req.session.destroy(() => res.redirect('/'));
    },

    // GET /registro  ->  formulario de registro
    register(req, res) {
        res.render('users/register');
    }
};

module.exports = userController;