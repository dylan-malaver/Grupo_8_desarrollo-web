// =========================================================
// Validaciones del servidor (Express Validator) para usuarios
// =========================================================
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../database/models');

// ---------- Reglas reutilizables ----------

// Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial
function strongPassword(value) {
    if (value.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
        throw new Error('La contraseña debe tener mayúsculas, minúsculas, un número y un carácter especial');
    }
    return true;
}

// Teléfono colombiano: 10 dígitos (acepta espacios, guiones y el indicativo +57)
function validPhone(value) {
    let digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 12 && digits.indexOf('57') === 0) digits = digits.slice(2);
    if (digits.length !== 10) {
        throw new Error('Ingresa un número de 10 dígitos, por ejemplo 301 582 1863');
    }
    return true;
}

// Si Multer rechazó la imagen, mostramos su motivo
const imageRule = body('image').custom((value, { req }) => {
    if (req.fileValidationError) throw new Error(req.fileValidationError);
    return true;
});

// ---------- Registro ----------
const registerValidations = [
    body('fullname')
        .trim()
        .notEmpty().withMessage('El nombre y el apellido son obligatorios').bail()
        .custom((value) => {
            const parts = value.split(/\s+/);
            if (parts.length < 2) throw new Error('Escribe tu nombre y tu apellido');
            if (parts.some((part) => part.length < 2)) {
                throw new Error('El nombre y el apellido deben tener al menos 2 caracteres');
            }
            return true;
        }),

    body('email')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio').bail()
        .isEmail().withMessage('Ingresa un correo válido, por ejemplo ejemplo@correo.com').bail()
        .custom(async (value) => {
            const existing = await db.User.findOne({ where: { email: value.toLowerCase() } });
            if (existing) throw new Error('Ya existe una cuenta con ese correo');
            return true;
        }),

    body('phone')
        .trim()
        .notEmpty().withMessage('El número de teléfono es obligatorio').bail()
        .custom(validPhone),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria').bail()
        .custom(strongPassword),

    body('confirmPassword')
        .notEmpty().withMessage('Confirma tu contraseña').bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('Las contraseñas no coinciden');
            return true;
        }),

    body('terms')
        .custom((value) => {
            if (!value) throw new Error('Debes aceptar los términos y la política de privacidad');
            return true;
        }),

    imageRule
];

// ---------- Login ----------
const loginValidations = [
    body('email')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio').bail()
        .isEmail().withMessage('Ingresa un correo válido, por ejemplo ejemplo@correo.com').bail()
        .custom(async (value) => {
            const user = await db.User.findOne({ where: { email: value.toLowerCase() } });
            if (!user) throw new Error('No existe una cuenta con ese correo');
            return true;
        }),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria').bail()
        .custom(async (value, { req }) => {
            const email = String(req.body.email || '').trim().toLowerCase();
            const user = await db.User.findOne({ where: { email } });

            // Si el correo no existe, el error ya se muestra en el campo del correo
            if (user && !bcrypt.compareSync(value, user.password)) {
                throw new Error('La contraseña no es correcta');
            }
            return true;
        })
];

// ---------- Editar perfil ----------
const profileValidations = [
    body('first_name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('last_name')
        .trim()
        .optional({ values: 'falsy' })
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),

    body('phone')
        .trim()
        .notEmpty().withMessage('El número de teléfono es obligatorio').bail()
        .custom(validPhone),

    // Cambiar la contraseña es opcional, pero si se escribe una nueva hay que dar la actual
    body('currentPassword')
        .custom(async (value, { req }) => {
            if (!req.body.newPassword) return true;
            if (!value) throw new Error('Escribe tu contraseña actual');

            const user = await db.User.findByPk(req.session.user.id);
            if (!user || !bcrypt.compareSync(value, user.password)) {
                throw new Error('La contraseña actual no es correcta');
            }
            return true;
        }),

    body('newPassword')
        .optional({ values: 'falsy' })
        .custom(strongPassword),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (req.body.newPassword && value !== req.body.newPassword) {
                throw new Error('Las contraseñas nuevas no coinciden');
            }
            return true;
        }),

    imageRule
];

module.exports = { registerValidations, loginValidations, profileValidations };
