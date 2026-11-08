const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'users.json');

const User = {
    readAll() {
        try {
            const raw = fs.readFileSync(file, 'utf-8');
            return raw.trim() ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    },

    writeAll(users) {
        fs.writeFileSync(file, JSON.stringify(users, null, 4), 'utf-8');
    },

    findByEmail(email) {
        const wanted = String(email || '').trim().toLowerCase();
        return this.readAll().find(u => String(u.email).toLowerCase() === wanted) || null;
    },

    findById(id) {
        return this.readAll().find(u => String(u.id) === String(id)) || null;
    },

    create(data) {
        const users = this.readAll();
        const nextId = users.length ? Math.max(...users.map(u => Number(u.id) || 0)) + 1 : 1;
        const newUser = { id: nextId, ...data };
        users.push(newUser);
        this.writeAll(users);
        return newUser;
    },

    // Datos que se guardan en la sesión (NUNCA la contraseña)
    toSession(user) {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            category: user.category,
            image: user.image || null
        };
    }
};

module.exports = User;