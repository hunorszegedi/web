const db = require('../config/db');

const Arena = {};

Arena.getAll = (callback) => {
    const query = 'SELECT * FROM Arenas';
    db.query(query, callback);
};

module.exports = Arena;
