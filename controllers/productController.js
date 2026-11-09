// =========================================================
// CONTROLADOR de productos (con Sequelize / MySQL):
// listado, búsqueda, detalle, carrito y administración (CRUD)
// =========================================================
const db = require('../database/models');
const { toView } = require('../utils/productMapper');

const { Op } = db.Sequelize;

// Siempre que leemos un producto traemos también su categoría y sus colores
const INCLUDE = [
    { model: db.Category, as: 'category' },
    { model: db.Color, as: 'colors', through: { attributes: [] } }
];

// Categorías y colores para los formularios y filtros
async function getFormData() {
    const [categories, colors] = await Promise.all([
        db.Category.findAll({ order: [['id', 'ASC']], raw: true }),
        db.Color.findAll({ order: [['id', 'ASC']], raw: true })
    ]);

    return { categories, colors };
}

// Lee y valida lo que llega del formulario de crear/editar
function readForm(req) {
    const name = (req.body.name || '').trim();
    const summary = (req.body.summary || '').trim();
    const description = (req.body.description || '').trim();
    const category = (req.body.category || '').trim();
    const price = Number(req.body.price);
    const colors = req.body.colors
        ? (Array.isArray(req.body.colors) ? req.body.colors : [req.body.colors])
        : [];

    const valid = Boolean(
        name && summary && description && category &&
        Number.isInteger(price) && price >= 1 && price <= 9999999 &&
        colors.length > 0
    );

    return { valid, name, summary, description, category, price, colors };
}

// Busca la categoría y los colores (por nombre) para guardar sus ids
async function findRelations(categoryName, colorNames) {
    const category = await db.Category.findOne({ where: { name: categoryName } });
    const colors = await db.Color.findAll({ where: { name: { [Op.in]: colorNames } } });

    return { category, colors };
}

function notFound(res, backUrl, backText) {
    return res.status(404).send(
        '<h1>Producto no encontrado</h1><p><a href="' + backUrl + '">' + backText + '</a></p>'
    );
}

const productController = {
    // GET /productos                           ->  todos los productos
    // GET /productos?categoria=ramos-de-flores ->  filtrado por categoría
    // GET /productos?q=rosas                   ->  búsqueda por nombre o descripción corta
    async list(req, res, next) {
        try {
            const { categories } = await getFormData();
            const current = categories.find((c) => c.slug === req.query.categoria) || null;
            const q = (req.query.q || '').trim();

            const where = {};
            if (current) where.category_id = current.id;
            if (q) {
                where[Op.or] = [
                    { name: { [Op.like]: '%' + q + '%' } },
                    { summary: { [Op.like]: '%' + q + '%' } }
                ];
            }

            const rows = await db.Product.findAll({ where, include: INCLUDE, order: [['id', 'ASC']] });

            res.render('products/productList', {
                categories,
                current,
                q,
                products: rows.map(toView)
            });
        } catch (error) {
            next(error);
        }
    },

    // ---------- ADMINISTRADOR ----------
    // Estas rutas están protegidas por el middleware requireAdmin (ver routes/productRoutes.js)

    // GET /admin/productos  ->  panel con la lista de productos
    async adminList(req, res, next) {
        try {
            const rows = await db.Product.findAll({ include: INCLUDE, order: [['id', 'ASC']] });
            res.render('products/productAdmin', { products: rows.map(toView) });
        } catch (error) {
            next(error);
        }
    },

    // GET /admin/productos/nuevo  ->  formulario para crear
    async create(req, res, next) {
        try {
            const { categories, colors } = await getFormData();
            res.render('products/productCreate', { product: null, categories, colors });
        } catch (error) {
            next(error);
        }
    },

    // POST /admin/productos  ->  guardar un producto nuevo
    async store(req, res, next) {
        try {
            const form = readForm(req);

            if (!form.valid) {
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

            const { category, colors } = await findRelations(form.category, form.colors);

            if (!category || colors.length === 0) {
                return res.status(400).send(
                    '<h1>Datos inválidos</h1><p>La categoría o los colores no existen.</p>' +
                    '<p><a href="/admin/productos/nuevo">Volver al formulario</a></p>'
                );
            }

            const product = await db.Product.create({
                name: form.name,
                summary: form.summary,
                description: form.description,
                details: form.description,
                care: '',
                price: form.price,
                image: req.file.filename,
                alt: form.name,
                category_id: category.id
            });

            await product.setColors(colors);

            return res.redirect('/admin/productos');
        } catch (error) {
            next(error);
        }
    },

    // GET /admin/productos/:id/editar  ->  formulario para editar
    async edit(req, res, next) {
        try {
            const row = await db.Product.findByPk(req.params.id, { include: INCLUDE });

            if (!row) return notFound(res, '/productos', 'Volver a los productos');

            const { categories, colors } = await getFormData();
            res.render('products/productEdit', { product: toView(row), categories, colors });
        } catch (error) {
            next(error);
        }
    },

    // PUT /products/:id (o POST /admin/productos/:id/editar)  ->  actualizar
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const product = await db.Product.findByPk(id);

            if (!product) return notFound(res, '/admin/productos', 'Volver a administración');

            const form = readForm(req);

            if (!form.valid) {
                return res.status(400).send(
                    '<h1>Datos inválidos</h1><p>Revisa los campos del formulario.</p>' +
                    '<p><a href="/admin/productos/' + encodeURIComponent(id) + '/editar">Volver al formulario</a></p>'
                );
            }

            const { category, colors } = await findRelations(form.category, form.colors);

            if (!category || colors.length === 0) {
                return res.status(400).send(
                    '<h1>Datos inválidos</h1><p>La categoría o los colores no existen.</p>' +
                    '<p><a href="/admin/productos/' + encodeURIComponent(id) + '/editar">Volver al formulario</a></p>'
                );
            }

            const changes = {
                name: form.name,
                summary: form.summary,
                description: form.description,
                details: form.description,
                price: form.price,
                alt: form.name,
                category_id: category.id
            };

            // Si se eligió otra imagen se cambia; si no, se conserva la anterior
            if (req.file) changes.image = req.file.filename;

            await product.update(changes);
            await product.setColors(colors);

            return res.redirect('/admin/productos');
        } catch (error) {
            next(error);
        }
    },

    // DELETE /products/:id (o POST /admin/productos/:id/eliminar)  ->  eliminar
    async remove(req, res, next) {
        try {
            const product = await db.Product.findByPk(req.params.id);

            if (!product) return notFound(res, '/admin/productos', 'Volver a administración');

            // La tabla product_color se limpia sola (ON DELETE CASCADE en la base de datos)
            await product.destroy();

            return res.redirect('/admin/productos');
        } catch (error) {
            next(error);
        }
    },

    // GET /detalle  ->  lleva al primer producto
    async detailRedirect(req, res, next) {
        try {
            const first = await db.Product.findOne({ order: [['id', 'ASC']] });
            res.redirect(first ? '/detalle/' + first.id : '/productos');
        } catch (error) {
            next(error);
        }
    },

    // GET /detalle/:id  ->  página de un producto
    async detail(req, res, next) {
        try {
            const row = await db.Product.findByPk(req.params.id, { include: INCLUDE });

            if (!row) return notFound(res, '/', 'Volver al inicio');

            const related = await db.Product.findAll({
                where: { id: { [Op.ne]: row.id } },
                include: INCLUDE,
                order: [['id', 'ASC']],
                limit: 4
            });

            res.render('products/productDetail', {
                product: toView(row),
                related: related.map(toView)
            });
        } catch (error) {
            next(error);
        }
    },

    // GET /carrito  ->  carrito de compras
    // (el carrito se guarda en el navegador; aquí solo enviamos el catálogo)
    async cart(req, res, next) {
        try {
            const rows = await db.Product.findAll({ include: INCLUDE, order: [['id', 'ASC']] });
            const products = rows.map(toView);

            res.render('products/productCart', {
                products,
                catalog: products.map((p) => ({
                    id: String(p.id),
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    image: p.image,
                    alt: p.alt
                }))
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = productController;