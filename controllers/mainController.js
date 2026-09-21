// =========================================================
// CONTROLADOR principal (la "C" del MVC): página de inicio
// =========================================================
const Product = require('../models/product');

const mainController = {
    // GET /  ->  Home con los 4 productos destacados
    index(req, res) {
        res.render('index', { featured: Product.findFeatured(4) });
    }
};

module.exports = mainController;