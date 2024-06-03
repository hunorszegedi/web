const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

// forum bejegyzesek listazasa
exports.listPosts = (req, res) => {
    Post.getAll((err, posts) => {
        if (err) {
            return res.status(500).send('Error retrieving posts'); // hiba eseten visszateres
        }
        
        const postsWithComments = posts.map(post => {
            return new Promise((resolve, reject) => {
                Comment.getAllByPostId(post.id, (err, comments) => {
                    if (err) {
                        reject(err);
                    } else {
                        post.comments = comments; // hozzaszolasok hozzaadasa a bejegyzeshez
                        resolve(post);
                    }
                });
            });
        });

        Promise.all(postsWithComments)
            .then(posts => {
                const userRole = req.session.user.role;
                res.render('forum', { posts, role: userRole }); // forum oldal renderelese
            })
            .catch(err => {
                res.status(500).send('Error retrieving comments'); // hiba eseten visszateres
            });
    });
};

// uj bejegyzes letrehozasa
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
            return res.status(500).send('Error creating post'); // hiba eseten visszateres
        }
        res.redirect('/forum'); // sikeres bejegyzes utan atiranyitas a forum oldalra
    });
};

// hozzaszolas hozzaadasa
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
            return res.status(500).send('Error adding comment'); // hiba eseten visszateres
        }
        res.redirect('/forum'); // sikeres hozzaszolas utan atiranyitas a forum oldalra
    });
};

// hozzaszolas torlese
exports.deleteComment = (req, res) => {
    const commentId = req.params.commentId;

    Comment.delete(commentId, (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting comment'); // hiba eseten visszateres
        }
        res.redirect('/forum'); // sikeres torles utan atiranyitas a forum oldalra
    });
};

// bejegyzes torlese
exports.deletePost = (req, res) => {
    const postId = req.params.postId;

    Post.delete(postId, (err, results) => {
        if (err) {
            return res.status(500).send('Error deleting post'); // hiba eseten visszateres
        }
        res.redirect('/forum'); // sikeres torles utan atiranyitas a forum oldalra
    });
};
