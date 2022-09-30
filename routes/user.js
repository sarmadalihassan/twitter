const userController = require("../controllers/user");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require('../middleware/multer'); 

router.post("/signup", upload.single('profilePicture'), userController.signUp);

router.post("/login", userController.loginUser);

router.get("/suggestions", auth, userController.whoToFollow);

router.post("/unfollow/:id", auth, userController.unfollowUser);
router.post("/follow/:id", auth, userController.followUser);
router.put("/wallet", auth, userController.editWalletAddress); 

router.get("/:id", auth, userController.getUser);
router.put("/:id", auth, userController.editUser);


router.delete("/:id", auth, userController.deleteUser); 

module.exports = router;
