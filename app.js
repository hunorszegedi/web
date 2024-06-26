const express = require('express');
// mysql2 modul importalasa
const mysql = require('mysql2');
// session kezeleshez szukseges express-session modul importalasa
const session = require('express-session');
// body-parser modul importalasa a bejovo kervenyek kezelesehez
const bodyParser = require('body-parser');
// path modul importalasa az utvonalak kezelesere
const path = require('path');
// multer modul importalasa a fajlfeltolteshez
const multer = require('multer'); 

// express alkalmazas letrehozasa
const app = express();

// multer konfiguracioja a fajlfeltolteshez
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // a fajlok mentesi helye
    },
    filename: (req, file, cb) => {
        cb(null, `${req.session.user.id}_${file.originalname}`); // egyedi fajlnev letrehozasa
    }
});
const upload = multer({ storage: storage });

// body-parser beallitasa az urlencoded es json adatok feldolgozasara
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// public konyvtar beallitasa statikus fajlok szolgalasara
app.use(express.static(path.join(__dirname, 'public')));

// session konfiguracioja
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// adatbazis kapcsolat letrehozasa
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'kyrieirving',
    password: 'megmutatom213213@',
    database: 'kyrieirving'
});

// adatbazis kapcsolat letrehozasa es hibakezeles
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// felhasznalo session informaciojanak beallitasa a valaszban
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// modellek importalasa
const Game = require('./models/gameModel');

// view engine beallitasa ejs-re
app.set('view engine', 'ejs');

// belepes ellenorzese middleware funkcio
function isLoggedIn(req, res, next) {
    if (req.session.loggedin) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// fooldal megjelenitese
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// kapcsolat oldal atranyitasa a fooldalra
app.get('/contact', (req, res) => {
    res.redirect('/');
});

// login oldal megjelenitese
app.get('/login', (req, res) => {
    res.render('login', { user: req.session.user });
});

// login feldolgozasa
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

// regisztracio oldal megjelenitese
app.get('/register', (req, res) => {
    res.render('register', { user: req.session.user });
});

// regisztracio feldolgozasa
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    connection.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, results) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

// dashboard oldal megjelenitese bejelentkezett felhasznaloknak
app.get('/dashboard', isLoggedIn, (req, res) => {
    const userId = req.session.user.id;
    connection.query('SELECT * FROM Photos WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1', [userId], (err, results) => {
        if (err) throw err;
        const profilePhoto = results.length > 0 ? results[0] : null;
        res.render('dashboard', { user: req.session.user, profilePhoto: profilePhoto });
    });
});

// profilkep feltoltese
app.post('/uploadPhoto', upload.single('profilePhoto'), isLoggedIn, (req, res) => {
    const userId = req.session.user.id;
    const fileName = req.file.filename;
    const filePath = `/images/${fileName}`;

    connection.query('INSERT INTO Photos (user_id, file_name, file_path) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE file_name = ?, file_path = ?', [userId, fileName, filePath, fileName, filePath], (err, results) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});

// forum oldal megjelenitese bejelentkezett felhasznaloknak
app.get('/forum', isLoggedIn, (req, res) => {
    connection.query('SELECT * FROM Posts', (err, posts) => {
        if (err) throw err;

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

        if (posts.length === 0) {
            res.render('forum', { 
                posts: postsWithComments,
                user: req.session.user,
                role: req.session.user.role
            });
        }
    });
});

// forum bejegyzes reszleteinek megjelenitese bejelentkezett felhasznaloknak
app.get('/forum/:id', isLoggedIn, (req, res) => {
    const postId = req.params.id;
    connection.query('SELECT Posts.*, Users.name AS author FROM Posts INNER JOIN Users ON Posts.user_id = Users.id WHERE Posts.id = ?', [postId], (err, postResults) => {
        if (err) throw err;
        if (postResults.length > 0) {
            const post = postResults[0];
            connection.query('SELECT Comments.*, Users.name AS author FROM Comments INNER JOIN Users ON Comments.user_id = Users.id WHERE post_id = ?', [postId], (err, commentResults) => {
                if (err) throw err;
                post.comments = commentResults;
                res.render('post_detail', { 
                    post: post,
                    user: req.session.user,
                    role: req.session.user.role
                });
            });
        } else {
            res.status(404).send('Post not found');
        }
    });
});

// uj forum bejegyzes letrehozasa bejelentkezett felhasznaloknak
app.post('/forum', isLoggedIn, (req, res) => {
    const { title, content } = req.body;
    const userId = req.session.user.id;
    connection.query('INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)', [userId, title, content], (err, results) => {
        if (err) throw err;
        res.redirect('/forum');
    });
});

// forum bejegyzesek keresese bejelentkezett felhasznaloknak
app.get('/forum/search', isLoggedIn, (req, res) => {
    const searchQuery = req.query.query;
    connection.query(
        'SELECT Posts.*, Users.name AS author FROM Posts INNER JOIN Users ON Posts.user_id = Users.id WHERE Posts.title LIKE ? OR Posts.content LIKE ?',
        [`%${searchQuery}%`, `%${searchQuery}%`],
        (err, posts) => {
            if (err) throw err;

            let postsWithComments = [];
            let postsProcessed = 0;

            posts.forEach(post => {
                connection.query('SELECT Comments.*, Users.name AS author FROM Comments INNER JOIN Users ON Comments.user_id = Users.id WHERE post_id = ?', [post.id], (err, comments) => {
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

            if (posts.length === 0) {
                res.render('forum', { 
                    posts: postsWithComments,
                    user: req.session.user,
                    role: req.session.user.role
                });
            }
        }
    );
});

// meccsek oldal megjelenitese bejelentkezett felhasznaloknak
app.get('/games', isLoggedIn, (req, res) => {
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
});

// jegyek oldal megjelenitese bejelentkezett felhasznaloknak
app.get('/tickets', isLoggedIn, (req, res) => {
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
});

// jegy torlese bejelentkezett admin vagy moderator felhasznaloknak
app.post('/delete_ticket', isLoggedIn, (req, res) => {
    if (req.session.user.role === 'admin' || req.session.user.role === 'moderator') {
        const { ticketId } = req.body;
        connection.query('DELETE FROM Tickets WHERE id = ?', [ticketId], (err, results) => {
            if (err) throw err;
            res.redirect('/tickets');
        });
    } else {
        res.redirect('/login');
    }
});

// jegy vasarlasi oldal megjelenitese bejelentkezett felhasznaloknak
app.get('/tickets/buy', isLoggedIn, (req, res) => {
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
});

// jegy vasarlas bejelentkezett felhasznaloknak
app.post('/buy_ticket', isLoggedIn, (req, res) => {
    const { gameId, seat, price } = req.body;
    const userId = req.session.user.id;
    connection.query('INSERT INTO Tickets (user_id, game_id, seat, price) VALUES (?, ?, ?, ?)', [userId, gameId, seat, price], (err, results) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});

// auth, game, forum, ticket utvonalak importalasa
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const forumRoutes = require('./routes/forumRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// auth, game, forum, ticket utvonalak hasznalata
app.use('/', authRoutes);
app.use('/games', gameRoutes);
app.use('/forum', forumRoutes);
app.use('/tickets', ticketRoutes);

// szerver inditasa a 3000-es porton
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
