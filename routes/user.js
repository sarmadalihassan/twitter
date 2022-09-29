const userController = require("../controllers/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
// const isAdmin = require("../middleware/admin.js");

router.post("/signup", userController.signUp);

router.post("/login", userController.loginUser);

router.get("/suggestions", auth, userController.whoToFollow);

router.post("/follow/:id", auth, userController.followUser);
router.post("/unfollow/:id", auth, userController.unfollowUser);

router.get("/:id", auth, userController.getUser);
router.put("/:id", auth, userController.editUser);

module.exports = router;
