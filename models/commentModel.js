const db = require('../config/db');

const Comment = {};

Comment.create = (comment, callback) => {
    const query = 'INSERT INTO Comments (post_id, user_id, content) VALUES (?, ?, ?)';
    db.query(query, [comment.post_id, comment.user_id, comment.content], callback);
};

Comment.getAllByPostId = (postId, callback) => {
    const query = 'SELECT * FROM Comments WHERE post_id = ?';
    db.query(query, [postId], callback);
};

module.exports = Comment;
