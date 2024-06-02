const db = require('../config/db');

const User = {};

User.create = (user, callback) => {
    const query = 'INSERT INTO Users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user.email, user.password, user.name, user.role, user.status], callback);
};

User.findByEmail = (email, callback) => {
    const query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, [email], callback);
};

module.exports = User;
