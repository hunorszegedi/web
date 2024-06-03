const Game = require('../models/gameModel');

// meccsek listazasa
exports.listGames = (req, res) => {
    Game.getAll((err, games) => {
        if (err) {
            return res.status(500).send('Error retrieving games'); // hiba eseten visszateres
        }
        res.render('game', { games }); // meccsek oldal renderelese a meccs adatokkal
    });
};
