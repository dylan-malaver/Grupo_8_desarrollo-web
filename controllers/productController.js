// =========================================================
// CONTROLADOR de productos
// =========================================================
const Product = require('../models/product');

const productController = {

    // GET /productos
    // GET /productos?categoria=ramos-de-flores
    list(req, res) {
        const categories = Product.getCategories();
        const current = categories.find((c) => c.slug === req.query.categoria) || null;

        const products = current
            ? Product.findByCategory(current.slug)
            : Product.findAll();

        res.render('products/productList', {
            categories,
            current,
            products
        });
    },

    // GET /detalle
    detailRedirect(req, res) {
        res.redirect('/detalle/' + Product.findAll()[0].id);
    },

    // GET /detalle/:id
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

    // GET /carrito
    cart(req, res) {
        res.render('products/productCart', {
            products: Product.findAll(),
            catalog: Product.getCatalog()
        });
    },

    // GET /productos/crear
    // Formulario para crear un producto
    createForm(req, res) {
        res.render('products/productForm', {
            product: null,
            categories: Product.getCategories()
        });
    },

    // GET /productos/editar/:id
    // Formulario para editar un producto
    editForm(req, res) {
        const product = Product.findById(req.params.id);

        if (!product) {
            return res
                .status(404)
                .send('<h1>Producto no encontrado</h1><p><a href="/productos">Volver a productos</a></p>');
        }

        res.render('products/productForm', {
            product,
            categories: Product.getCategories()
        });
    },

    // POST /productos/crear
    // Todavía no guarda de verdad, eso llega en el Sprint 4 (JSON + métodos HTTP)
    create(req, res) {
        console.log('Producto a crear:', req.body);
        res.redirect('/productos');
    },

    // POST /productos/editar/:id
    // Todavía no guarda de verdad, eso llega en el Sprint 4
    edit(req, res) {
        console.log('Producto a editar (id ' + req.params.id + '):', req.body);
        res.redirect('/productos');
    }
};

module.exports = productController;