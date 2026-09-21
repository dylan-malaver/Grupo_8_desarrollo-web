const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/login', userController.login);
router.get('/registro', userController.register);

module.exports = router;