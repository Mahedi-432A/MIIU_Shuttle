
const express = require("express");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware.js");
const {
  registerUserDetails,
  getUserProfile,
  updateUserProfile,
  registerFcmToken, // ✅ ইম্পোর্ট
} = require("../controllers/user.controller.js");

const router = express.Router();

// ইউজার প্রোফাইল রুট
router.post("/register-details", verifyFirebaseToken, registerUserDetails);
router.get("/profile", verifyFirebaseToken, getUserProfile);
router.put("/profile", verifyFirebaseToken, updateUserProfile);

// ✅ নতুন FCM টোকেন রুট
router.post("/register-fcm-token", verifyFirebaseToken, registerFcmToken);

module.exports = router;