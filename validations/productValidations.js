// =========================================================
// Validaciones del servidor (Express Validator) para productos
// =========================================================
const { body } = require('express-validator');
const db = require('../database/models');

const { Op } = db.Sequelize;

function toArray(value) {
    if (value === undefined || value === null || value === '') return [];
    return Array.isArray(value) ? value : [value];
}

const baseRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre del producto es obligatorio').bail()
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres').bail()
        .isLength({ max: 60 }).withMessage('El nombre no puede superar los 60 caracteres'),

    body('summary')
        .trim()
        .notEmpty().withMessage('La descripción corta es obligatoria').bail()
        .isLength({ min: 10 }).withMessage('La descripción corta debe tener al menos 10 caracteres').bail()
        .isLength({ max: 100 }).withMessage('La descripción corta no puede superar los 100 caracteres'),

    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria').bail()
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres').bail()
        .isLength({ max: 400 }).withMessage('La descripción no puede superar los 400 caracteres'),

    // La categoría debe existir en la base de datos (tabla secundaria)
    body('category')
        .trim()
        .notEmpty().withMessage('Selecciona una categoría').bail()
        .custom(async (value) => {
            const category = await db.Category.findOne({ where: { name: value } });
            if (!category) throw new Error('La categoría seleccionada no existe');
            return true;
        }),

    body('price')
        .custom((value) => {
            const raw = String(value === undefined ? '' : value).trim();

            if (!raw) throw new Error('El precio es obligatorio');
            if (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 9999999) {
                throw new Error('Ingresa un precio válido: solo números enteros, mayor a 0 y hasta 9.999.999');
            }
            return true;
        }),

    // Los colores deben existir en la base de datos (tabla secundaria)
    body('colors')
        .custom(async (value) => {
            const names = toArray(value);

            if (names.length === 0) throw new Error('Selecciona al menos un color');

            const found = await db.Color.count({ where: { name: { [Op.in]: names } } });
            if (found !== new Set(names).size) {
                throw new Error('Alguno de los colores seleccionados no existe');
            }
            return true;
        })
];

// Crear: la imagen es obligatoria
const createProductValidations = [
    ...baseRules,
    body('image').custom((value, { req }) => {
        if (req.fileValidationError) throw new Error(req.fileValidationError);
        if (!req.file) throw new Error('Selecciona una imagen del producto');
        return true;
    })
];

// Editar: la imagen es opcional (si no se elige, se conserva la actual)
const updateProductValidations = [
    ...baseRules,
    body('image').custom((value, { req }) => {
        if (req.fileValidationError) throw new Error(req.fileValidationError);
        return true;
    })
];

module.exports = { createProductValidations, updateProductValidations };
