
const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.json');

// Leer los productos guardados en el archivo JSON
function readProducts() {
    const data = fs.readFileSync(productsFile, 'utf8');
    return JSON.parse(data);
}

// Guardar los productos en el archivo JSON
function saveProducts(products) {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 4), 'utf8');
}

// Convertir nombres de categorías en direcciones web
function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const categories = [
    'Ramos de flores',
    'Arreglos florales',
    'Detalles románticos',
    'Cumpleaños',
    'Aniversarios',
    'Ocasiones especiales'
].map((name) => ({
    name,
    slug: slugify(name)
}));

const colorOptions = [
    { name: 'Rojo', swatch: '#c62828' },
    { name: 'Rosado', swatch: '#f48fb1' },
    { name: 'Blanco', swatch: '#ffffff' },
    { name: 'Amarillo', swatch: '#fdd835' },
    { name: 'Naranja', swatch: '#fb8c00' },
    { name: 'Morado', swatch: '#8e24aa' },
    {
        name: 'Multicolor',
        swatch: 'conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)'
    }
];

// Obtener todos los productos
function getProducts() {
    return readProducts().map((product) => ({
        ...product,
        categorySlug: slugify(product.category)
    }));
}

const Product = {
    findAll() {
        return getProducts();
    },

    findById(id) {
        return getProducts().find((product) => product.id === id);
    },

    findFeatured(limit = 4) {
        return getProducts().slice(0, limit);
    },

    findRelated(id) {
        return getProducts().filter((product) => product.id !== id);
    },

    getCategories() {
        return categories;
    },

    getColors() {
        return colorOptions;
    },

    findByCategory(slug) {
        return getProducts().filter((product) => product.categorySlug === slug);
    },

    getCatalog() {
        return getProducts().map(({ id, name, category, price, image, alt }) => ({
            id,
            name,
            category,
            price,
            image,
            alt
        }));
    },

    // Crear un producto nuevo
    create(product) {
        const products = readProducts();
        products.push(product);
        saveProducts(products);
        return product;
    },

    // Actualizar un producto existente
    update(id, updatedData) {
        const products = readProducts();
        const index = products.findIndex((product) => product.id === id);

        if (index === -1) {
            return null;
        }

        products[index] = {
            ...products[index],
            ...updatedData,
            id
        };

        saveProducts(products);
        return products[index];
    },

    // Eliminar un producto
    delete(id) {
        const products = readProducts();
        const index = products.findIndex((product) => product.id === id);

        if (index === -1) {
            return false;
        }

        products.splice(index, 1);
        saveProducts(products);
        return true;
    }
};

module.exports = Product;
