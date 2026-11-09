// Fotos de perfil -> public/img/users
const path = require('path');
const createUploader = require('./createUploader');

module.exports = createUploader(path.join(__dirname, '..', 'public', 'img', 'users'), 'user-');