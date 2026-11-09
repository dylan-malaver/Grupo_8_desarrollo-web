// =========================================================
// Convierte un producto de Sequelize (con su categoría y colores)
// en un objeto simple con la forma que ya usan las vistas EJS.
// =========================================================
function toView(product) {
    const p = typeof product.get === 'function' ? product.get({ plain: true }) : product;

    return {
        id: p.id,
        name: p.name,
        summary: p.summary,
        description: p.description,
        details: p.details,
        care: p.care,
        price: p.price,
        image: p.image,
        alt: p.alt || p.name,
        category: p.category ? p.category.name : '',
        categorySlug: p.category ? p.category.slug : '',
        colors: (p.colors || []).map((color) => color.name)
    };
}

module.exports = { toView };