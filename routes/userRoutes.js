const express = require('express');
const userController = require('../controllers/userController');
const uploadUser = require('../config/uploadUser');
const uploadImage = require('../middlewares/uploadImage');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    registerValidations,
    loginValidations,
    profileValidations
} = require('../validations/userValidations');

const router = express.Router();

// Solo huéspedes (sin sesión)
router.get('/login', guestMiddleware, userController.login);
router.post('/login', guestMiddleware, loginValidations, userController.loginSubmit);
router.get('/registro', guestMiddleware, userController.register);
router.post('/registro', guestMiddleware, uploadImage(uploadUser), registerValidations, userController.registerSubmit);

// Solo usuarios con sesión
router.get('/perfil', authMiddleware, userController.profile);
router.get('/perfil/editar', authMiddleware, userController.edit);
router.put('/perfil', authMiddleware, uploadImage(uploadUser), profileValidations, userController.update);
router.get('/logout', authMiddleware, userController.logout);

module.exports = router;
