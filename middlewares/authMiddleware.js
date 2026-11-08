// Rutas SOLO para usuarios logueados (perfil): si no hay sesión, va al login.
function authMiddleware(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
}

module.exports = authMiddleware;