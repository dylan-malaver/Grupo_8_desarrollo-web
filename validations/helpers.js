const { validationResult } = require('express-validator');

// Devuelve los errores como un objeto { campo: { msg } } (un mensaje por campo).
// Si falló la subida de la imagen, solo mostramos ese error (el resto del formulario llegó incompleto).
function getErrors(req) {
    const mapped = validationResult(req).mapped();

    if (req.uploadAborted && mapped.image) {
        return { image: mapped.image };
    }

    return mapped;
}

module.exports = { getErrors };
