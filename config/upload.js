
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'public', 'img');

// Crear la carpeta de imágenes si no existe.
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Configurar dónde y con qué nombre se guardan las imágenes.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = 'producto-' + Date.now() + extension;

        cb(null, uniqueName);
    }
});

// Aceptar solamente imágenes JPG, PNG y WebP de máximo 2 MB.
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes JPG, PNG o WebP.'));
        }
    }
});

module.exports = upload;
