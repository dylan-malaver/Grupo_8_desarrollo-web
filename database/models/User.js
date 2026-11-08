module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        first_name: { type: DataTypes.STRING(60), allowNull: false },
        last_name: { type: DataTypes.STRING(60), allowNull: false, defaultValue: '' },
        email: { type: DataTypes.STRING(120), allowNull: false, unique: true },
        phone: { type: DataTypes.STRING(20), allowNull: true },
        password: { type: DataTypes.STRING(100), allowNull: false },
        image: { type: DataTypes.STRING(255), allowNull: true },
        user_category_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
    }, {
        tableName: 'users',
        timestamps: false
    });

    User.associate = (db) => {
        // Cada usuario pertenece a una categoría (admin o cliente)
        User.belongsTo(db.UserCategory, { as: 'category', foreignKey: 'user_category_id' });
    };

    return User;
};
