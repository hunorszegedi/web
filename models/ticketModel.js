const db = require('../config/db');

// ticket objektum letrehozasa
const Ticket = {};

// create fuggveny, ami egy uj jegyet hoz letre az adatbazisban
Ticket.create = (ticket, callback) => {
    const query = 'INSERT INTO Tickets (user_id, game_id, seat, price) VALUES (?, ?, ?, ?)';
    db.query(query, [ticket.user_id, ticket.game_id, ticket.seat, ticket.price], callback);
};

// getByUserId fuggveny, ami lekerdezi a felhasznalo jegyeit az adatbazisbol
Ticket.getByUserId = (userId, callback) => {
    const query = `
        SELECT Tickets.*, Games.home_team_id, Games.away_team_id, Games.game_date 
        FROM Tickets 
        JOIN Games ON Tickets.game_id = Games.id 
        WHERE Tickets.user_id = ?`;
    db.query(query, [userId], callback);
};

// ticket objektum exportalasa
module.exports = Ticket;
