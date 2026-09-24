// =========================================================
// CONTROLADOR de productos: listado, detalle, carrito y administración
// =========================================================
const Product = require('../models/product');

const productController = {
    // GET /productos  ->  listado de todos los productos
    // GET /productos?categoria=ramos-de-flores  ->  listado filtrado por categoría
    list(req, res) {
        const categories = Product.getCategories();
        const current = categories.find((c) => c.slug === req.query.categoria) || null;
        const products = current ? Product.findByCategory(current.slug) : Product.findAll();

        res.render('products/productList', { categories, current, products });
    },

    // ---------- ADMINISTRADOR ----------
    // Estas rutas están protegidas por el middleware requireAdmin (ver routes/productRoutes.js)

    // GET /admin/productos  ->  panel con la lista de productos y el botón "Editar"
    adminList(req, res) {
        res.render('products/productAdmin', { products: Product.findAll() });
    },

    // GET /admin/productos/nuevo  ->  formulario para crear un producto
    create(req, res) {
        res.render('products/productCreate', {
            product: null,
            categories: Product.getCategories(),
            colors: Product.getColors()
        });
    },

    // GET /admin/productos/:id/editar  ->  formulario para editar un producto
    edit(req, res) {
        const product = Product.findById(req.params.id);

        if (!product) {
            return res
                .status(404)
                .send('<h1>Producto no encontrado</h1><p><a href="/productos">Volver a los productos</a></p>');
        }

        res.render('products/productEdit', {
            product,
            categories: Product.getCategories(),
            colors: Product.getColors()
        });
    },

    // GET /detalle  ->  lleva al primer producto
    detailRedirect(req, res) {
        res.redirect('/detalle/' + Product.findAll()[0].id);
    },

    // GET /detalle/:id  ->  página de un producto
    detail(req, res) {
        const product = Product.findById(req.params.id);

        if (!product) {
            return res
                .status(404)
                .send('<h1>Producto no encontrado</h1><p><a href="/">Volver al inicio</a></p>');
        }

        res.render('products/productDetail', {
            product,
            related: Product.findRelated(product.id)
        });
    },

    // GET /carrito  ->  carrito de compras
    // (el carrito se guarda en el navegador; aquí solo enviamos el catálogo)
    cart(req, res) {
        res.render('products/productCart', {
            products: Product.findAll(),
            catalog: Product.getCatalog()
        });
    }
};

module.exports = productController;