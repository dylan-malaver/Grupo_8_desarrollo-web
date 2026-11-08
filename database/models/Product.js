module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(60), allowNull: false },
        summary: { type: DataTypes.STRING(100), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        details: { type: DataTypes.TEXT, allowNull: true },
        care: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        image: { type: DataTypes.STRING(255), allowNull: false },
        alt: { type: DataTypes.STRING(120), allowNull: true },
        category_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
    }, {
        tableName: 'products',
        timestamps: false
    });

    Product.associate = (db) => {
        // Cada producto pertenece a una categoría
        Product.belongsTo(db.Category, { as: 'category', foreignKey: 'category_id' });

        // Un producto tiene muchos colores (tabla intermedia product_color)
        Product.belongsToMany(db.Color, {
            as: 'colors',
            through: 'product_color',
            foreignKey: 'product_id',
            otherKey: 'color_id',
            timestamps: false
        });
    };

    return Product;
};
