const express = require('express');
// router objektum letrehozasa az express.Router() segitsegevel
const router = express.Router();
// gameController importalasa a controllers mappabol
const gameController = require('../controllers/gameController');

// meccsek listazasa
router.get('/', gameController.listGames);

// router exportalasa
module.exports = router;
