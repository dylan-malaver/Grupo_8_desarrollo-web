module.exports = (sequelize, DataTypes) => {
    const UserCategory = sequelize.define('UserCategory', {
        id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(30), allowNull: false, unique: true }
    }, {
        tableName: 'user_categories',
        timestamps: false
    });

    UserCategory.associate = (db) => {
        // Una categoría de usuario (admin, cliente) tiene muchos usuarios
        UserCategory.hasMany(db.User, { as: 'users', foreignKey: 'user_category_id' });
    };

    return UserCategory;
};
