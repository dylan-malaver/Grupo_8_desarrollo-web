// =========================================================
// MODELO de productos (la "M" del MVC)
// Aquí viven los datos y las funciones para consultarlos.
// Los controladores usan este archivo; las vistas nunca lo tocan directo.
//
// Para agregar un producto nuevo, copia un bloque y cambia los datos.
// - id:      va en la dirección de la página (/detalle/<id>). Sin espacios ni tildes.
// - image:   nombre del archivo dentro de public/img
// - price:   número sin puntos (85000 = $ 85.000 COP)
// - colors:  lista de colores del producto; deben existir en colorOptions (más abajo)
// =========================================================
const products = [
    {
        id: 'ramo-rosas-rojas',
        name: 'Ramo de Rosas Rojas',
        category: 'Ramos de flores',
        summary: 'Clásico ramo de rosas rojas seleccionadas con follaje fino.',
        description: 'Un elegante ramo de rosas pensado para expresar cariño, amor y celebrar momentos especiales',
        details: 'Ramo de rosas rojas seleccionadas con follaje fino y envoltorio de regalo con lazo. Disponible para pedido y entrega a domicilio en San Gil.',
        care: 'Colócalo en un florero con agua limpia, corta un poco los tallos en diagonal y cambia el agua cada dos días. Mantenlo lejos del sol directo.',
        price: 85000,
        image: 'prod-rosas-rojas.jpg',
        alt: 'Ramo de rosas rojas con lazo',
        colors: ['Rojo', 'Blanco']
    },
    {
        id: 'arreglo-floral-elegante',
        name: 'Arreglo Floral Elegante',
        category: 'Arreglos florales',
        summary: 'Composición mixta con lirios, rosas y flores de temporada.',
        description: 'Una composición mixta con lirios, rosas y flores de temporada, armada en una base especial para destacar en cualquier lugar.',
        details: 'Arreglo con lirios, rosas y flores de temporada en una base especial. Disponible para pedido y entrega a domicilio en San Gil.',
        care: 'Mantén el agua o la espuma floral siempre húmeda y ubica el arreglo lejos del sol directo y de corrientes de aire.',
        price: 120000,
        image: 'prod-arreglo-elegante.jpg',
        alt: 'Arreglo floral elegante',
        colors: ['Rosado', 'Blanco']
    },
    {
        id: 'ramo-flores-mixtas',
        name: 'Ramo de Flores Mixtas',
        category: 'Ramos de flores',
        summary: 'Combinación silvestre multicolor para alegrar cualquier día.',
        description: 'Una combinación silvestre y multicolor de flores, ideal para alegrar cualquier día y sorprender a alguien especial.',
        details: 'Ramo de flores mixtas en colores vivos, con estilo silvestre. Disponible para pedido y entrega a domicilio en San Gil.',
        care: 'Colócalo en un florero con agua limpia, corta un poco los tallos en diagonal y cambia el agua cada dos días. Mantenlo lejos del sol directo.',
        price: 65000,
        image: 'prod-flores-mixtas.jpg',
        alt: 'Ramo de flores mixtas',
        colors: ['Multicolor', 'Amarillo', 'Rosado']
    },
    {
        id: 'detalle-floral-romantico',
        name: 'Detalle Floral Romántico',
        category: 'Detalles románticos',
        summary: 'Caja de flores en tonos pastel con tarjeta personalizada.',
        description: 'Una caja de flores en tonos pastel con tarjeta personalizada, la combinación ideal para enamorar y crear instantes mágicos.',
        details: 'Caja de flores en tonos pastel con tarjeta personalizada. Disponible para pedido y entrega a domicilio en San Gil.',
        care: 'Mantén la espuma floral húmeda y ubica la caja lejos del sol directo y de corrientes de aire.',
        price: 95000,
        image: 'prod-detalle-romantico.jpg',
        alt: 'Detalle floral romántico en tonos pastel',
        colors: ['Rosado']
    },
    {
        id: 'arreglo-cumpleanos',
        name: 'Arreglo cumpleaños',
        category: 'Cumpleaños',
        summary: 'Colores vivos y flores frescas para celebrar un cumpleaños con alegría.',
        description: 'Colores vivos y flores frescas para desear el mejor de los cumpleaños con alegría.',
        details: 'Arreglo de colores vivos con flores frescas para cumpleaños. Disponible para pedido y entrega a domicilio en San Gil.',
        care: 'Mantén el agua o la espuma floral siempre húmeda y ubica el arreglo lejos del sol directo.',
        price: 70000,
        image: 'cat-cumpleanos.jpg',
        alt: 'Globos de colores para cumpleaños',
        colors: ['Multicolor']
    }
];

// Convierte "Detalles románticos" en "detalles-romanticos" (para usarlo en la dirección)
function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Categorías del sitio (las mismas 6 del home)
const categories = [
    'Ramos de flores',
    'Arreglos florales',
    'Detalles románticos',
    'Cumpleaños',
    'Aniversarios',
    'Ocasiones especiales'
].map((name) => ({ name, slug: slugify(name) }));

// Colores que se pueden elegir en el formulario de administrador
// (swatch = cómo se pinta el circulito de color)
const colorOptions = [
    { name: 'Rojo',       swatch: '#c62828' },
    { name: 'Rosado',     swatch: '#f48fb1' },
    { name: 'Blanco',     swatch: '#ffffff' },
    { name: 'Amarillo',   swatch: '#fdd835' },
    { name: 'Naranja',    swatch: '#fb8c00' },
    { name: 'Morado',     swatch: '#8e24aa' },
    { name: 'Multicolor', swatch: 'conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)' }
];

// Cada producto guarda también el "slug" de su categoría
products.forEach((p) => {
    p.categorySlug = slugify(p.category);
});

const Product = {
    // Todos los productos
    findAll() {
        return products;
    },

    // Un producto por su id (devuelve undefined si no existe)
    findById(id) {
        return products.find((p) => p.id === id);
    },

    // Los primeros N productos (los "destacados" del home)
    findFeatured(limit = 4) {
        return products.slice(0, limit);
    },

    // Todos menos el indicado ("También te puede interesar")
    findRelated(id) {
        return products.filter((p) => p.id !== id);
    },

    // Las 6 categorías del sitio: [{ name, slug }]
    getCategories() {
        return categories;
    },

    // Colores disponibles para el formulario: [{ name, swatch }]
    getColors() {
        return colorOptions;
    },

    // Productos de una categoría, según su slug (por ejemplo "ramos-de-flores")
    findByCategory(slug) {
        return products.filter((p) => p.categorySlug === slug);
    },

    // Versión reducida que usa el carrito en el navegador
    getCatalog() {
        return products.map(({ id, name, category, price, image, alt }) => ({
            id, name, category, price, image, alt
        }));
    }
};

module.exports = Product;