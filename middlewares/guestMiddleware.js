// Rutas SOLO para huéspedes (login, registro): si ya hay sesión, va al perfil.
function guestMiddleware(req, res, next) {
    if (req.session && req.session.user) {
        return res.redirect('/perfil');
    }
    next();
}

module.exports = guestMiddleware;