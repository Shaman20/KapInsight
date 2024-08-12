const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");
const verifyToken = require("../middleware/auth");

router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);
router.post("/logout", verifyToken, userController.logout);

module.exports = router;
