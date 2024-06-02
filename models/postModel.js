const db = require('../config/db');

const Post = {};

Post.create = (post, callback) => {
    const query = 'INSERT INTO Posts (user_id, title, content) VALUES (?, ?, ?)';
    db.query(query, [post.user_id, post.title, post.content], callback);
};

Post.getAll = (callback) => {
    const query = 'SELECT * FROM Posts';
    db.query(query, callback);
};

module.exports = Post;
