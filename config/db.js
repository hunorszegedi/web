const mysql = require('mysql2');

// kapcsolat letrehozasa a MySQL adatbazishoz
const connection = mysql.createConnection({
    host: 'localhost', // az adatbazis szerver cime
    user: 'kyrieirving', // az adatbazis felhasznalo neve
    password: 'megmutatom213213@', // az adatbazis felhasznalo jelszava
    database: 'kyrieirving' // az adatbazis neve
});

// kapcsolat megnyitasa es hibaellenorzes
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err); // hibauzenet kiirasa, ha a csatlakozas sikertelen
        return;
    }
    console.log('Connected to MySQL Database.'); // uzenet kiirasa, ha a csatlakozas sikeres
});

module.exports = connection; // kapcsolat exportalasa mas modulok szamara
