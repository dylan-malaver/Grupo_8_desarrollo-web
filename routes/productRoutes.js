const express = require('express');
const productController = require('../controllers/productController');
const requireAdmin = require('../middlewares/requireAdmin');

const router = express.Router();

// Tienda
router.get('/productos', productController.list);
router.get('/detalle', productController.detailRedirect);
router.get('/detalle/:id', productController.detail);
router.get('/carrito', productController.cart);

// Administrador: panel, crear y editar productos.
// requireAdmin exige haber iniciado sesión como administrador (ver /login).
router.get('/admin/productos', requireAdmin, productController.adminList);
router.get('/admin/productos/nuevo', requireAdmin, productController.create);
router.get('/admin/productos/:id/editar', requireAdmin, productController.edit);

module.exports = router;