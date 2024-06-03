const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.listPosts = (req, res) => {
    Post.getAll((err, posts) => {
        if (err) {
            return res.status(500).send('Error retrieving posts');
        }
        
        // Kommentek betöltése minden poszthoz
        const postsWithComments = posts.map(post => {
            return new Promise((resolve, reject) => {
                Comment.getAllByPostId(post.id, (err, comments) => {
                    if (err) {
                        reject(err);
                    } else {
                        post.comments = comments;
                        resolve(post);
                    }
                });
            });
        });

        Promise.all(postsWithComments)
            .then(posts => {
                const userRole = req.session.user.role; // Hozzáadjuk a felhasználói szerepkört
                res.render('forum', { posts, role: userRole });
            })
            .catch(err => {
                res.status(500).send('Error retrieving comments');
            });
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

exports.addComment = (req, res) => {
    const { content } = req.body;
    const postId = req.params.postId;
    const userId = req.session.user.id;

    const newComment = {
        post_id: postId,
        user_id: userId,
        content
    };

    Comment.create(newComment, (err, results) => {
        if (err) {
            return res.status(500).send('Error adding comment');
        }
        res.redirect('/forum');
    });
};

exports.deleteComment = (req, res) => {
    const commentId = req.params.commentId;

    Comment.delete(commentId, (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting comment');
        }
        res.redirect('/forum');
    });
};

exports.deletePost = (req, res) => {
    const postId = req.params.postId;

    Post.delete(postId, (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting post');
        }
        res.redirect('/forum');
    });
};
