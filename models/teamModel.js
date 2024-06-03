const db = require('../config/db');

// team objektum letrehozasa
const Team = {};

// getAll fuggveny, ami lekerdezi az osszes csapatot az adatbazisbol
Team.getAll = (callback) => {
    const query = 'SELECT * FROM Teams';
    db.query(query, callback);
};

// team objektum exportalasa
module.exports = Team;
