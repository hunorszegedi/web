const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'kyrieirving',
    password: 'megmutatom213213@',
    database: 'kyrieirving'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.user = results[0];
            res.redirect('/dashboard');
        } else {
            res.send('Incorrect Email and/or Password!');
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    connection.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.render('dashboard', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.get('/forum', (req, res) => {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM Posts', (err, posts) => {
            if (err) throw err;
            res.render('forum', { posts: posts });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/forum', (req, res) => {
    if (req.session.loggedin) {
        const { title, content } = req.body;
        const userId = req.session.user.id;
        connection.query('INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content], (err, results) => {
            if (err) throw err;
            res.redirect('/forum');
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/games', (req, res) => {
    if (req.session.loggedin) {
        connection.query('SELECT * FROM Games', (err, games) => {
            if (err) throw err;
            res.render('game', { games: games });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/buy_ticket', (req, res) => {
    if (req.session.loggedin) {
        const { gameId, seat, price } = req.body;
        const userId = req.session.user.id;
        connection.query('INSERT INTO Tickets (user_id, game_id, seat, price) VALUES (?, ?, ?, ?)', [userId, gameId, seat, price], (err, results) => {
            if (err) throw err;
            res.redirect('/dashboard');
        });
    } else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
