const express = require('express');
// router objektum letrehozasa az express.Router() segitsegevel
const router = express.Router();
// forumController importalasa a controllers mappabol
const forumController = require('../controllers/forumController');

// forum bejegyzesek listazasa
router.get('/', forumController.listPosts);
// uj forum bejegyzes letrehozasa
router.post('/', forumController.createPost);
// hozzaszolas hozzaadasa a megadott bejegyzeshez
router.post('/addComment/:postId', forumController.addComment);
// hozzaszolas torlese a megadott hozzaszolas id alapjan
router.post('/deleteComment/:commentId', forumController.deleteComment);
// bejegyzes torlese a megadott bejegyzes id alapjan
router.post('/deletePost/:postId', forumController.deletePost);

// router exportalasa
module.exports = router;
