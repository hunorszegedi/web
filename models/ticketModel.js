const db = require('../config/db');

const Ticket = {};

Ticket.create = (ticket, callback) => {
    const query = 'INSERT INTO Tickets (user_id, game_id, seat, price) VALUES (?, ?, ?, ?)';
    db.query(query, [ticket.user_id, ticket.game_id, ticket.seat, ticket.price], callback);
};

Ticket.getByUserId = (userId, callback) => {
    const query = 'SELECT * FROM Tickets WHERE user_id = ?';
    db.query(query, [userId], callback);
};

module.exports = Ticket;
