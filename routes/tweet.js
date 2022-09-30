const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const tweetController = require("../controllers/tweet");
const upload = require('../middleware/multer'); 

router.post("/", auth, upload.single('media'), tweetController.postTweet);

router.get("/", auth, tweetController.getHomePage);

router.get("/trends", auth, tweetController.getTrends);

router.get("/own", auth, tweetController.getOwnTweets);

router.post("/like/:id", auth, tweetController.likeTweet);

router.post("/repost/:id", auth, tweetController.repostTweet);

router.get("/:id", auth, tweetController.getTweet);

router.post("/:id", auth, tweetController.postTweetReply);

module.exports = router;
