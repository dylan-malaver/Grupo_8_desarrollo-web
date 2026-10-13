// =========================================================
// CONTROLADOR de productos: listado, detalle, carrito y administración
// =========================================================
const Product = require('../models/product');
const path = require('path');

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
    
    // POST /admin/productos: guardar un producto nuevo
    store(req, res) {
        const name = (req.body.name || '').trim();
        const summary = (req.body.summary || '').trim();
        const description = (req.body.description || '').trim();
        const category = (req.body.category || '').trim();
        const price = Number(req.body.price);
        const colors = req.body.colors
            ? (Array.isArray(req.body.colors) ? req.body.colors : [req.body.colors])
            : [];

        if (!name || !summary || !description || !category ||
            !Number.isInteger(price) || price < 1 || price > 9999999 ||
            colors.length === 0) {
            return res.status(400).send(
                '<h1>Datos inválidos</h1><p>Revisa los campos del formulario.</p>' +
                '<p><a href="/admin/productos/nuevo">Volver al formulario</a></p>'
            );
        }

        if (!req.file) {
            return res.status(400).send(
                '<h1>Falta la imagen</h1><p>Selecciona una imagen para el producto.</p>' +
                '<p><a href="/admin/productos/nuevo">Volver al formulario</a></p>'
            );
        }

        const idBase = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        let id = idBase || 'producto';
        let contador = 1;

        while (Product.findById(id)) {
            id = idBase + '-' + contador;
            contador++;
        }

        const product = {
            id,
            name,
            summary,
            description,
            details: description,
            care: '',
            category,
            price,
            image: req.file.filename,
            alt: name,
            colors
        };

        Product.create(product);

        return res.redirect('/admin/productos');
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
    
    // POST /admin/productos/:id/editar: actualizar un producto existente
    update(req, res) {
        const id = req.params.id;
        const existingProduct = Product.findById(id);

        if (!existingProduct) {
            return res.status(404).send(
                '<h1>Producto no encontrado</h1>' +
                '<p><a href="/admin/productos">Volver a administración</a></p>'
            );
        }

        const name = (req.body.name || '').trim();
        const summary = (req.body.summary || '').trim();
        const description = (req.body.description || '').trim();
        const category = (req.body.category || '').trim();
        const price = Number(req.body.price);

        const colors = req.body.colors
            ? (Array.isArray(req.body.colors)
                ? req.body.colors
                : [req.body.colors])
            : [];

        if (
            !name ||
            !summary ||
            !description ||
            !category ||
            !Number.isInteger(price) ||
            price < 1 ||
            price > 9999999 ||
            colors.length === 0
        ) {
            return res.status(400).send(
                '<h1>Datos inválidos</h1>' +
                '<p>Revisa los campos del formulario.</p>' +
                '<p><a href="/admin/productos/' + encodeURIComponent(id) +
                '/editar">Volver al formulario</a></p>'
            );
        }

        const updatedData = {
            name,
            summary,
            description,
            details: description,
            category,
            price,
            colors,
            alt: name
        };

        // Si se seleccionó otra imagen, actualizar su nombre.
        // Si no se seleccionó una imagen, conservar la anterior.
        if (req.file) {
            updatedData.image = req.file.filename;
        }

        Product.update(id, updatedData);

        return res.redirect('/admin/productos');
    },


    // POST /admin/productos/:id/eliminar: eliminar un producto
    remove(req, res) {
        const id = req.params.id;

        const product = Product.findById(id);

        if (!product) {
            return res.status(404).send(
                '<h1>Producto no encontrado</h1>' +
                '<p><a href="/admin/productos">Volver a administración</a></p>'
            );
        }

        const deleted = Product.delete(id);

        if (!deleted) {
            return res.status(500).send(
                '<h1>No se pudo eliminar el producto</h1>' +
                '<p><a href="/admin/productos">Volver a administración</a></p>'
            );
        }

        return res.redirect('/admin/productos');
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