const express = require('express');
const productController = require('../controllers/productController');
const requireAdmin = require('../middlewares/requireAdmin');
const upload = require('../config/upload');

const router = express.Router();

// Tienda
// Rutas REST solicitadas para el Sprint 4
router.get('/products', productController.list);

router.get('/products/create', requireAdmin, productController.create);

router.get('/products/:id/edit', requireAdmin, productController.edit);

router.get('/products/:id', productController.detail);

router.post('/products',requireAdmin,upload.single('image'),productController.store);

router.get('/productos', productController.list);
router.get('/detalle', productController.detailRedirect);
router.get('/detalle/:id', productController.detail);
router.get('/carrito', productController.cart);

// Administrador: panel, crear y editar productos.
// requireAdmin exige haber iniciado sesión como administrador (ver /login).
router.get('/admin/productos', requireAdmin, productController.adminList);
router.get('/admin/productos/nuevo', requireAdmin, productController.create);
router.post('/admin/productos', requireAdmin, upload.single('image'), productController.store);
router.get('/admin/productos/:id/editar', requireAdmin, productController.edit);
router.post('/admin/productos/:id/editar',requireAdmin,upload.single('image'),productController.update);
// POST /admin/productos/:id/eliminar: eliminar un producto
router.post('/admin/productos/:id/eliminar',requireAdmin,productController.remove);

// Actualizar un producto mediante PUT
router.put('/products/:id',requireAdmin,upload.single('image'),productController.update);

// Eliminar un producto mediante DELETE
router.delete('/products/:id',requireAdmin,productController.remove);

module.exports = router;