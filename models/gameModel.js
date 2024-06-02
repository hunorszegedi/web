const db = require('../config/db');

const Game = {};

Game.getAll = (callback) => {
    const query = 'SELECT * FROM Games';
    db.query(query, callback);
};

module.exports = Game;
