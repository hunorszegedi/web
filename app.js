const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware beállítások
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Adatbázis kapcsolat
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

// Middleware to set the role for the session
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Modellek importálása
const Game = require('./models/gameModel');

// View engine beállítás
app.set('view engine', 'ejs');

// Alap útvonalak
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user });
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
    res.render('register', { user: req.session.user });
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

            // Add comments to each post
            let postsWithComments = [];
            let postsProcessed = 0;

            posts.forEach(post => {
                connection.query('SELECT * FROM Comments WHERE post_id = ?', [post.id], (err, comments) => {
                    if (err) throw err;

                    post.comments = comments;
                    postsWithComments.push(post);
                    postsProcessed++;

                    if (postsProcessed === posts.length) {
                        res.render('forum', { 
                            posts: postsWithComments,
                            user: req.session.user,
                            role: req.session.user.role
                        });
                    }
                });
            });

            // If there are no posts
            if (posts.length === 0) {
                res.render('forum', { 
                    posts: postsWithComments,
                    user: req.session.user,
                    role: req.session.user.role
                });
            }
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
        connection.query(`
            SELECT Games.*, 
                   home_team.name AS home_team_name, 
                   away_team.name AS away_team_name, 
                   Arenas.name AS arena_name
            FROM Games
            INNER JOIN Teams AS home_team ON Games.home_team_id = home_team.id
            INNER JOIN Teams AS away_team ON Games.away_team_id = away_team.id
            INNER JOIN Arenas ON Games.arena_id = Arenas.id
        `, (err, games) => {
            if (err) throw err;
            res.render('game', { games: games, user: req.session.user });
        });
    } else {
        res.redirect('/login');
    }
});


app.get('/tickets', (req, res) => {
    if (req.session.loggedin) {
        let query;
        const params = [];

        if (req.session.user.role === 'admin' || req.session.user.role === 'moderator') {
            query = `
                SELECT Tickets.*, Games.game_date, home_team.name AS home_team, away_team.name AS away_team, Users.name AS user_name
                FROM Tickets
                INNER JOIN Games ON Tickets.game_id = Games.id
                INNER JOIN Teams AS home_team ON Games.home_team_id = home_team.id
                INNER JOIN Teams AS away_team ON Games.away_team_id = away_team.id
                INNER JOIN Users ON Tickets.user_id = Users.id
            `;
        } else {
            query = `
                SELECT Tickets.*, Games.game_date, home_team.name AS home_team, away_team.name AS away_team
                FROM Tickets
                INNER JOIN Games ON Tickets.game_id = Games.id
                INNER JOIN Teams AS home_team ON Games.home_team_id = home_team.id
                INNER JOIN Teams AS away_team ON Games.away_team_id = away_team.id
                WHERE Tickets.user_id = ?
            `;
            params.push(req.session.user.id);
        }

        connection.query(query, params, (err, results) => {
            if (err) throw err;

            results.forEach(ticket => {
                ticket.game_date = new Date(ticket.game_date).toLocaleString("hu-HU");
            });

            res.render('tickets', { tickets: results, user: req.session.user, role: req.session.user.role });
        });
    } else {
        res.redirect('/login');
    }
});

app.post('/delete_ticket', (req, res) => {
    if (req.session.loggedin && (req.session.user.role === 'admin' || req.session.user.role === 'moderator')) {
        const { ticketId } = req.body;
        connection.query('DELETE FROM Tickets WHERE id = ?', [ticketId], (err, results) => {
            if (err) throw err;
            res.redirect('/tickets');
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/tickets/buy', (req, res) => {
    if (req.session.loggedin) {
        connection.query(`
            SELECT Games.*, home_team.name AS home_team_name, away_team.name AS away_team_name
            FROM Games
            INNER JOIN Teams AS home_team ON Games.home_team_id = home_team.id
            INNER JOIN Teams AS away_team ON Games.away_team_id = away_team.id
        `, (err, games) => {
            if (err) throw err;

            connection.query('SELECT DISTINCT seat, price FROM Tickets', (err, seats) => {
                if (err) throw err;

                res.render('buy_ticket', { games: games, seats: seats, user: req.session.user });
            });
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

// Útvonalak beállítása
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const forumRoutes = require('./routes/forumRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

app.use('/', authRoutes);
app.use('/games', gameRoutes);
app.use('/forum', forumRoutes);
app.use('/tickets', ticketRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
