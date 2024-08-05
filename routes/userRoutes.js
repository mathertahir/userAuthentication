const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  ResetPassword,
} = require("../controllers/userController");
const { validateUser } = require("../middleware/usermiddeware/validator");

router.post("/register", validateUser, registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", ResetPassword);

module.exports = router;
