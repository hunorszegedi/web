const express = require('express');
// router objektum letrehozasa az express.Router() segitsegevel
const router = express.Router();
// authController importalasa a controllers mappabol
const authController = require('../controllers/authController');

// login oldal megjelenitese
router.get('/login', (req, res) => res.render('login'));
// login form feldolgozasa
router.post('/login', authController.login);
// regisztracio oldal megjelenitese
router.get('/register', (req, res) => res.render('register'));
// regisztracio form feldolgozasa
router.post('/register', authController.register);
// kijelentkezes kezeles
router.get('/logout', authController.logout);

// router exportalasa
module.exports = router;
