// Prueba rápida: node database/testConnection.js
const db = require('./models');

(async () => {
    try {
        await db.sequelize.authenticate();
        console.log('✔ Conexión con MySQL correcta');

        const products = await db.Product.findAll({
            include: [
                { model: db.Category, as: 'category' },
                { model: db.Color, as: 'colors' }
            ]
        });

        console.log('Productos encontrados:', products.length);
        products.forEach(p => {
            console.log('-', p.name, '|', p.category.name, '|', p.colors.map(c => c.name).join(', '));
        });

        const admin = await db.User.findOne({ include: { model: db.UserCategory, as: 'category' } });
        console.log('Primer usuario:', admin ? admin.email + ' (' + admin.category.name + ')' : 'ninguno');
    } catch (error) {
        console.error('✘ Error:', error.message);
    } finally {
        await db.sequelize.close();
    }
})();
