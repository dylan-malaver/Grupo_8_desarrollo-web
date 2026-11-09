const express = require('express');
const userController = require('../controllers/userController');
const uploadUser = require('../config/uploadUser');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Subida de la foto de perfil con manejo de errores de Multer (tipo o tamaño inválido).
// "view" es la página que se vuelve a mostrar si hay un error.
function uploadAvatar(view) {
    return (req, res, next) => {
        uploadUser.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).render(view, {
                    error: err.message,
                    old: req.body || {},
                    user: req.session.user || null
                });
            }
            next();
        });
    };
}

// Solo huéspedes (sin sesión)
router.get('/login', guestMiddleware, userController.login);
router.post('/login', guestMiddleware, userController.loginSubmit);
router.get('/registro', guestMiddleware, userController.register);
router.post('/registro', guestMiddleware, uploadAvatar('users/register'), userController.registerSubmit);

// Solo usuarios con sesión
router.get('/perfil', authMiddleware, userController.profile);
router.get('/perfil/editar', authMiddleware, userController.edit);
router.put('/perfil', authMiddleware, uploadAvatar('users/profileEdit'), userController.update);
router.get('/logout', authMiddleware, userController.logout);

module.exports = router;
