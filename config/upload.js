// Imágenes de productos -> public/img
const path = require('path');
const createUploader = require('./createUploader');

module.exports = createUploader(path.join(__dirname, '..', 'public', 'img'), 'producto-');
