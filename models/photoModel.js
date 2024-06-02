const db = require('../config/db');

const Photo = {};

Photo.create = (photo, callback) => {
    const query = 'INSERT INTO Photos (user_id, file_name, file_path) VALUES (?, ?, ?)';
    db.query(query, [photo.user_id, photo.file_name, photo.file_path], callback);
};

Photo.getAllByUserId = (userId, callback) => {
    const query = 'SELECT * FROM Photos WHERE user_id = ?';
    db.query(query, [userId], callback);
};

module.exports = Photo;
