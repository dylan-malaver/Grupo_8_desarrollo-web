// Configuración de Sequelize para la base de datos de XAMPP (MySQL/MariaDB)
const base = {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,   // XAMPP: root sin contraseña
    database: process.env.DB_NAME || 'floristeria_andrea',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false                               // cambia a console.log para ver el SQL
};

module.exports = {
    development: base,
    test: base,
    production: base
};
