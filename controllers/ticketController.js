const connection = require('../config/db');

// jegyek listazasa
exports.listTickets = (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).send('User not logged in'); // ha nincs bejelentkezve a felhasznalo
    }
    
    const userId = req.session.user.id;
    connection.query(`
        SELECT Tickets.*, Teams1.name as home_team, Teams2.name as away_team, Games.game_date 
        FROM Tickets 
        JOIN Games ON Tickets.game_id = Games.id 
        JOIN Teams AS Teams1 ON Games.home_team_id = Teams1.id 
        JOIN Teams AS Teams2 ON Games.away_team_id = Teams2.id 
        WHERE Tickets.user_id = ?`, [userId], (err, tickets) => {
        if (err) {
            return res.status(500).send('Error retrieving tickets'); // hiba eseten visszateres
        }
        res.render('ticket', { tickets: tickets }); // jegyek oldal renderelese a jegy adatokkal
    });
};

// jegyvasarlas oldal megjelenitese
exports.showBuyTicketPage = (req, res) => {
    const gameQuery = 'SELECT g.id, t1.name as home_team, t2.name as away_team, g.game_date FROM Games g JOIN Teams t1 ON g.home_team_id = t1.id JOIN Teams t2 ON g.away_team_id = t2.id';

    connection.query(gameQuery, (err, games) => {
        if (err) {
            return res.status(500).send('Error retrieving games'); // hiba eseten visszateres
        }

        res.render('buy_ticket', {
            games: games // jegyvasarlas oldal renderelese a meccs adatokkal
        });
    });
};

// jegyvasarlas funkcio
exports.buyTicket = (req, res) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).send('User not logged in'); // ha nincs bejelentkezve a felhasznalo
    }

    const { gameId, seat } = req.body;
    const userId = req.session.user.id;
    
    connection.query('SELECT price FROM Tickets WHERE game_id = ? AND seat = ?', [gameId, seat], (err, results) => {
        if (err) {
            return res.status(500).send('Error retrieving seat price'); // hiba eseten visszateres
        }
        if (results.length === 0) {
            return res.status(404).send('Seat not found'); // ha nincs ilyen ulohely
        }
        const price = results[0].price;

        connection.query('INSERT INTO Tickets (user_id, game_id, seat, price) VALUES (?, ?, ?, ?)', [userId, gameId, seat, price], (err, results) => {
            if (err) {
                return res.status(500).send('Error buying ticket'); // hiba eseten visszateres
            }
            res.redirect('/tickets'); // sikeres jegyvasarlas utan visszairanyitas a jegyek oldalra
        });
    });
};
