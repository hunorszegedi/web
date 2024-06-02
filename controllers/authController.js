const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.register = (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = {
        email,
        password: hashedPassword,
        name,
        role: 'user',
        status: 'active'
    };

    User.create(newUser, (err, results) => {
        if (err) {
            return res.status(500).send('Error registering the user');
        }
        res.redirect('/login');
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).send('Incorrect email or password');
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send('Incorrect email or password');
        }

        req.session.loggedin = true;
        req.session.user = user;
        res.redirect('/dashboard');
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
