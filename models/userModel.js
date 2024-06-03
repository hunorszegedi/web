const db = require('../config/db');

// user objektum letrehozasa
const User = {};

// create fuggveny, ami egy uj felhasznalot hoz letre az adatbazisban
User.create = (user, callback) => {
    const query = 'INSERT INTO Users (email, password, name, role, status) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [user.email, user.password, user.name, user.role, user.status], callback);
};

// findByEmail fuggveny, ami lekerdezi a felhasznalot az email cime alapjan az adatbazisbol
User.findByEmail = (email, callback) => {
    const query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, [email], callback);
};

// user objektum exportalasa
module.exports = User;
