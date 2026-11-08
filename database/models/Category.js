module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(60), allowNull: false, unique: true },
        slug: { type: DataTypes.STRING(80), allowNull: false, unique: true }
    }, {
        tableName: 'categories',
        timestamps: false
    });

    Category.associate = (db) => {
        // Una categoría tiene muchos productos
        Category.hasMany(db.Product, { as: 'products', foreignKey: 'category_id' });
    };

    return Category;
};
