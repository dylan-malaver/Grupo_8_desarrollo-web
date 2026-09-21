// =========================================================
// CONTROLADOR de usuarios: login y registro
// (por ahora solo muestran las páginas; el guardado de datos llega en sprints siguientes)
// =========================================================
const userController = {
    // GET /login  ->  formulario de inicio de sesión
    login(req, res) {
        res.render('users/login');
    },

    // GET /registro  ->  formulario de registro
    register(req, res) {
        res.render('users/register');
    }
};

module.exports = userController;