const Ticket = require('../models/ticketModel');

exports.listTickets = (req, res) => {
    const userId = req.session.user.id;
    Ticket.getByUserId(userId, (err, tickets) => {
        if (err) {
            return res.status(500).send('Error retrieving tickets');
        }
        res.render('ticket', { tickets });
    });
};

exports.buyTicket = (req, res) => {
    const { gameId, seat, price } = req.body;
    const userId = req.session.user.id;

    const newTicket = {
        user_id: userId,
        game_id: gameId,
        seat,
        price
    };

    Ticket.create(newTicket, (err, results) => {
        if (err) {
            return res.status(500).send('Error buying ticket');
        }
        res.redirect('/tickets');
    });
};
