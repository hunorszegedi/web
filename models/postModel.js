const db = require('../config/db');

const Post = {};

Post.create = (post, callback) => {
    const query = 'INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)';
    db.query(query, [post.user_id, post.title, post.content], callback);
};

Post.getAll = (callback) => {
    const query = 'SELECT * FROM Posts';
    db.query(query, [], callback);
};

Post.delete = (postId, callback) => {
    const query = 'DELETE FROM Posts WHERE id = ?';
    db.query(query, [postId], callback);
};

module.exports = Post;
