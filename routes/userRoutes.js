const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/login', userController.login);
router.post('/login', userController.loginSubmit);
router.get('/logout', userController.logout);
router.get('/registro', userController.register);

module.exports = router;