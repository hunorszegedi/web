const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

router.get('/', forumController.listPosts);
router.post('/', forumController.createPost);
router.post('/addComment/:postId', forumController.addComment);
router.post('/deleteComment/:commentId', forumController.deleteComment);
router.post('/deletePost/:postId', forumController.deletePost);

module.exports = router;
