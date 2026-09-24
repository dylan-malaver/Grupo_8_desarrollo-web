// =========================================================
// MIDDLEWARE: exige haber iniciado sesión como administrador.
// Si no hay sesión activa, redirige al login y recuerda a dónde
// quería ir el usuario (con ?redirect=...) para llevarlo ahí después.
// =========================================================
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }

    res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
}

module.exports = requireAdmin;