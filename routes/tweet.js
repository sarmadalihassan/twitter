const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const tweetController = require("../controllers/tweet");

router.post("/", auth, tweetController.postTweet);

router.get("/", auth, tweetController.getHomePage);

router.get("/own", auth, tweetController.getOwnTweets);

router.get("/:id", auth, tweetController.getTweet);

module.exports = router;
