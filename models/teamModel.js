const db = require('../config/db');

const Team = {};

Team.getAll = (callback) => {
    const query = 'SELECT * FROM Teams';
    db.query(query, callback);
};

module.exports = Team;
