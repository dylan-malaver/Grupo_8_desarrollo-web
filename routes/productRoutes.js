const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();

router.get('/productos', productController.list);

router.get('/detalle', productController.detailRedirect);

router.get('/detalle/:id', productController.detail);

router.get('/carrito', productController.cart);

router.get('/productos/crear', productController.createForm);
router.post('/productos/crear', productController.create);

router.get('/productos/editar/:id', productController.editForm);
router.post('/productos/editar/:id', productController.edit);

module.exports = router;