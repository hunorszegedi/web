const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'kyrieirving',
    password: 'megmutatom213213@',
    database: 'kyrieirving'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

module.exports = connection;
