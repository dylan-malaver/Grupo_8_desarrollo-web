// Sube la imagen (campo "image") y, si Multer falla (por ejemplo, pesa más de 2 MB),
// no corta el pedido: anota el motivo para que Express Validator lo muestre como un error más.
function uploadImage(uploader) {
    return (req, res, next) => {
        uploader.single('image')(req, res, (err) => {
            if (err) {
                req.uploadAborted = true;
                req.fileValidationError = err.code === 'LIMIT_FILE_SIZE'
                    ? 'La imagen no puede pesar más de 2 MB.'
                    : 'No se pudo subir la imagen.';
            }
            next();
        });
    };
}

module.exports = uploadImage;
