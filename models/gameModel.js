const db = require('../config/db');

// Game modell objektum
const Game = {};

// osszes meccs lekerdezese
Game.getAll = (callback) => {
    const query = 'SELECT * FROM Games';
    db.query(query, callback); // lekerdezes vegrehajtasa
};

module.exports = Game; // Game modell exportalasa
