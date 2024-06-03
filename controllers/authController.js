const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// regisztracios fuggveny
exports.register = (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8); // jelszo hashelese

    const newUser = {
        email,
        password: hashedPassword,
        name,
        role: 'user',
        status: 'active'
    };

    User.create(newUser, (err, results) => {
        if (err) {
            return res.status(500).send('Error registering the user'); // hiba eseten visszateres
        }
        res.redirect('/login'); // sikeres regisztracio utan atiranyitas a bejelentkezes oldalra
    });
};

// bejelentkezesi fuggveny
exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Incorrect email or password'); // hibas email vagy jelszo eseten visszatérés
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password); // jelszo ellenorzese

        if (!passwordIsValid) {
            return res.status(401).send('Incorrect email or password'); // hibas jelszo eseten visszatérés
        }

        req.session.loggedin = true;
        req.session.user = user; // bejelentkezes eseten session beallitas
        res.redirect('/dashboard'); // sikeres bejelentkezes utan atiranyitas a dashboard oldalra
    });
};

// kijelentkezesi fuggveny
exports.logout = (req, res) => {
    req.session.destroy(); // session torlese
    res.redirect('/login'); // kijelentkezes utan atiranyitas a bejelentkezes oldalra
};
