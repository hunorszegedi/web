const Post = require('../models/postModel');

exports.listPosts = (req, res) => {
    Post.getAll((err, posts) => {
        if (err) {
            return res.status(500).send('Error retrieving posts');
        }
        res.render('forum', { posts });
    });
};

exports.createPost = (req, res) => {
    const { title, content } = req.body;
    const userId = req.session.user.id;

    const newPost = {
        user_id: userId,
        title,
        content
    };

    Post.create(newPost, (err, results) => {
        if (err) {
            return res.status(500).send('Error creating post');
        }
        res.redirect('/forum');
    });
};
