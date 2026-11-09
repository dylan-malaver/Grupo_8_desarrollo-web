// Middleware de APLICACIÓN: corre en cada pedido.
// 1) Si no hay sesión pero existe la cookie "recordarme", loguea al usuario.
// 2) Deja al usuario disponible en todas las vistas como "userLogged".
const db = require('../database/models');
const { toSession } = require('../utils/userMapper');

async function userLoggedMiddleware(req, res, next) {
    try {
        res.locals.userLogged = null;

        const cookieId = req.signedCookies && req.signedCookies.rememberUser;

        if (!req.session.user && cookieId) {
            const user = await db.User.findByPk(cookieId, {
                include: [{ model: db.UserCategory, as: 'category' }]
            });

            if (user) {
                req.session.user = toSession(user);
                req.session.isAdmin = req.session.user.category === 'admin';
            } else {
                res.clearCookie('rememberUser'); // el usuario ya no existe
            }
        }

        if (req.session.user) {
            res.locals.userLogged = req.session.user;
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = userLoggedMiddleware;
