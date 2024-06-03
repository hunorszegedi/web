const db = require('../config/db');

// Comment modell objektum
const Comment = {};

// uj komment letrehozasa
Comment.create = (comment, callback) => {
    const query = 'INSERT INTO Comments (post_id, user_id, content) VALUES (?, ?, ?)';
    db.query(query, [comment.post_id, comment.user_id, comment.content], callback); // lekerdezes vegrehajtasa
};

// osszes komment lekerdezese egy adott bejegyzeshez
Comment.getAllByPostId = (postId, callback) => {
    const query = 'SELECT * FROM Comments WHERE post_id = ?';
    db.query(query, [postId], callback); // lekerdezes vegrehajtasa
};

// komment torlese
Comment.delete = (commentId, callback) => {
    const query = 'DELETE FROM Comments WHERE id = ?';
    db.query(query, [commentId], callback); // lekerdezes vegrehajtasa
};

module.exports = Comment; // Comment modell exportalasa
