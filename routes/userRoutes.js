const express = require('express');
const userController = require('../controllers/userController');
const uploadUser = require('../config/uploadUser');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Subida de imagen con manejo de errores de Multer (tipo o tamaño inválido)
function uploadAvatar(req, res, next) {
    uploadUser.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).render('users/register', {
                error: err.message,
                old: req.body || {}
            });
        }
        next();
    });
}

// Solo huéspedes
router.get('/login', guestMiddleware, userController.login);
router.post('/login', guestMiddleware, userController.loginSubmit);
router.get('/registro', guestMiddleware, userController.register);
router.post('/registro', guestMiddleware, uploadAvatar, userController.registerSubmit);

// Solo usuarios logueados
router.get('/perfil', authMiddleware, userController.profile);
router.get('/logout', authMiddleware, userController.logout);

module.exports = router;