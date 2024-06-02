const connection = require('../config/db');

exports.listTickets = (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).send('User not logged in');
    }
    
    const userId = req.session.user.id;
    connection.query(`
        SELECT Tickets.*, Games.home_team_id, Games.away_team_id, Games.game_date 
        FROM Tickets 
        JOIN Games ON Tickets.game_id = Games.id 
        WHERE Tickets.user_id = ?`, [userId], (err, tickets) => {
        if (err) {
            return res.status(500).send('Error retrieving tickets');
        }
        res.render('ticket', { tickets: tickets });
    });
};

exports.buyTicket = (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).send('User not logged in');
    }

    const { gameId, seat, price } = req.body;
    const userId = req.session.user.id;
    connection.query('INSERT INTO Tickets (user_id, game_id, seat, price) VALUES (?, ?, ?, ?)', [userId, gameId, seat, price], (err, results) => {
        if (err) {
            return res.status(500).send('Error buying ticket');
        }
        res.redirect('/tickets');
    });
};
