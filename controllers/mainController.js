// =========================================================
// CONTROLADOR principal (la "C" del MVC): página de inicio
// =========================================================
const db = require('../database/models');
const { toView } = require('../utils/productMapper');

const mainController = {
    // GET /  ->  Home con los 4 productos destacados (los primeros de la base de datos)
    async index(req, res, next) {
        try {
            const rows = await db.Product.findAll({
                include: [{ model: db.Category, as: 'category' }],
                order: [['id', 'ASC']],
                limit: 4
            });

            res.render('index', { featured: rows.map(toView) });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = mainController;