const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const hashTagPlusController = require("../controllers/hashTagPlus");

router.post("/", auth, hashTagPlusController.startHashTagPlus);

module.exports = router;
