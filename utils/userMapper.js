// =========================================================
// Convierte un usuario de Sequelize (con su categoría) en el objeto
// pequeño que se guarda en la sesión. NUNCA incluye la contraseña.
// =========================================================
function toSession(user) {
    const u = typeof user.get === 'function' ? user.get({ plain: true }) : user;

    return {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phone: u.phone || '',
        category: u.category ? u.category.name : '',
        image: u.image || null
    };
}

module.exports = { toSession };
