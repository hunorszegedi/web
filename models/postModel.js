const db = require('../config/db');

// Post modell objektum
const Post = {};

// uj post letrehozasa
Post.create = (post, callback) => {
    const query = 'INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)';
    db.query(query, [post.user_id, post.title, post.content], callback); // lekerdezes vegrehajtasa
};

// osszes post lekerdezese
Post.getAll = (callback) => {
    const query = 'SELECT * FROM Posts';
    db.query(query, [], callback); // lekerdezes vegrehajtasa
};

// post torlese ID alapjan
Post.delete = (postId, callback) => {
    const query = 'DELETE FROM Posts WHERE id = ?';
    db.query(query, [postId], callback); // lekerdezes vegrehajtasa
};

module.exports = Post; // Post modell exportalasa
