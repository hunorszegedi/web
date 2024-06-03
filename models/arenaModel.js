const db = require('../config/db');

// Arena modell objektum
const Arena = {};

// osszes arena lekerdezese
Arena.getAll = (callback) => {
    const query = 'SELECT * FROM Arenas'; // SQL lekerdezes
    db.query(query, callback); // lekerdezes vegrehajtasa
};

module.exports = Arena; // Arena modell exportalasa
