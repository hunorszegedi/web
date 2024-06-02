const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// List all tickets for the logged-in user
router.get('/', ticketController.listTickets);

// Show the ticket purchase form
router.get('/buy', (req, res) => {
    res.render('buy_ticket', { user: req.session.user });
});

// Handle ticket purchase
router.post('/buy', ticketController.buyTicket);

module.exports = router;
