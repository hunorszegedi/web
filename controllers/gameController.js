const Game = require('../models/gameModel');

exports.listGames = (req, res) => {
    Game.getAll((err, games) => {
        if (err) {
            return res.status(500).send('Error retrieving games');
        }
        res.render('game', { games });
    });
};
