const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/', (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).send('User not logged in');
    }
    
    connection.query('SELECT Tickets.*, Games.home_team_id, Games.away_team_id, Games.game_date FROM Tickets INNER JOIN Games ON Tickets.game_id = Games.id WHERE user_id = ?', [req.session.user.id], (err, tickets) => {
        if (err) {
            return res.status(500).send('Error retrieving tickets');
        }
        res.render('tickets', { tickets: tickets });
    });
});

router.get('/buy', (req, res) => {
    connection.query('SELECT Games.id, home_team.name AS home_team, away_team.name AS away_team, Games.game_date FROM Games JOIN Teams AS home_team ON Games.home_team_id = home_team.id JOIN Teams AS away_team ON Games.away_team_id = away_team.id', (err, games) => {
        if (err) {
            return res.status(500).send('Error retrieving games');
        }
        connection.query('SELECT DISTINCT seat, price FROM Tickets', (err, seats) => {
            if (err) {
                return res.status(500).send('Error retrieving seats and prices');
            }
            res.render('buy_ticket', { games: games, seats: seats });
        });
    });
});

router.post('/buy', (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).send('User not logged in');
    }

    const { gameId, seat } = req.body;
    const userId = req.session.user.id;
    
    connection.query('SELECT price FROM Tickets WHERE seat = ? AND game_id = ?', [seat, gameId], (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving seat price');
        }
        if (results.length === 0) {
            return res.status(404).send('Seat not found');
        }
        const price = results[0].price;

        connection.query('INSERT INTO Tickets (user_id, game_id, seat, price) VALUES (?, ?, ?, ?)', [userId, gameId, seat, price], (err, results) => {
            if (err) {
                return res.status(500).send('Error buying ticket');
            }
            res.redirect('/tickets');
        });
    });
});

module.exports = router;
