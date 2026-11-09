// =========================================================
// Crea un "subidor" de imágenes con Multer.
// Solo acepta JPG, JPEG, PNG y GIF de máximo 2 MB.
// Si el archivo no es válido NO se guarda: se anota el motivo en
// req.fileValidationError y Express Validator lo muestra como error del campo.
// =========================================================
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.gif'];

function createUploader(folder, prefix) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, folder),
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();
            cb(null, prefix + Date.now() + extension);
        }
    });

    return multer({
        storage,
        limits: { fileSize: 2 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();

            if (ALLOWED_MIME.includes(file.mimetype) && ALLOWED_EXT.includes(extension)) {
                return cb(null, true);
            }

            req.fileValidationError = 'La imagen debe ser un archivo JPG, JPEG, PNG o GIF.';
            cb(null, false);
        }
    });
}

module.exports = createUploader;
