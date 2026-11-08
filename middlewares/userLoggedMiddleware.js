// Middleware de APLICACIÓN: corre en cada pedido.
// 1) Si no hay sesión pero existe la cookie "recordarme", loguea al usuario.
// 2) Deja al usuario disponible en todas las vistas como "userLogged".
const User = require('../models/user');

function userLoggedMiddleware(req, res, next) {
    res.locals.userLogged = null;

    const cookieId = req.signedCookies && req.signedCookies.rememberUser;

    if (!req.session.user && cookieId) {
        const user = User.findById(cookieId);
        if (user) {
            req.session.user = User.toSession(user);
            req.session.isAdmin = user.category === 'admin';
        }
    }

    if (req.session.user) {
        res.locals.userLogged = req.session.user;
    }

    next();
}

module.exports = userLoggedMiddleware;