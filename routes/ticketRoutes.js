const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Jegyek listázása
router.get('/', (req, res) => {
    connection.query('SELECT Tickets.*, Games.home_team_id, Games.away_team_id, Games.game_date FROM Tickets INNER JOIN Games ON Tickets.game_id = Games.id WHERE user_id = ?', [req.session.user.id], (err, tickets) => {
        if (err) {
            return res.status(500).send('Error retrieving tickets');
        }
        res.render('tickets', { tickets: tickets });
    });
});

// Jegyvásárlási oldal megjelenítése
router.get('/buy', (req, res) => {
    connection.query('SELECT * FROM Games', (err, games) => {
        if (err) {
            return res.status(500).send('Error retrieving games');
        }
        res.render('buy_ticket', { games: games });
    });
});

// Jegyvásárlás kezelése
router.post('/buy', (req, res) => {
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
});

module.exports = router;
