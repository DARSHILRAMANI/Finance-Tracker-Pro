const express = require("express");
const auth = require("../middleware/auth");
const {
  register,
  login,
  getProfile,
  verifyOtp,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  sentOtp,
  updateUserProfile,
  resendOtp,
  sendWelcomeEmail,
} = require("../controllers/authController");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);

router.get("/profile", auth, getProfile);

router.put("/update-profile", auth, updateUserProfile);

// router.post("/forgot-password/send-otp", sendForgotPasswordOtp);
// router.post("/forgot-password/reset", resetPasswordWithOtp);
router.post("/forgot-password", sendForgotPasswordOtp);
router.post("/reset-password", resetPasswordWithOtp);
router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);
router.post("/sent-otp", sentOtp);
router.post("/send-welcome-email", sendWelcomeEmail);

module.exports = router;
