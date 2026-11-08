module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define('Color', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(30), allowNull: false, unique: true },
        swatch: { type: DataTypes.STRING(200), allowNull: false }
    }, {
        tableName: 'colors',
        timestamps: false
    });

    Color.associate = (db) => {
        // Un color puede estar en muchos productos (tabla intermedia product_color)
        Color.belongsToMany(db.Product, {
            as: 'products',
            through: 'product_color',
            foreignKey: 'color_id',
            otherKey: 'product_id',
            timestamps: false
        });
    };

    return Color;
};
