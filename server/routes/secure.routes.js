// const express = require("express");
// const { verifyFirebaseToken } = require("../middlewares/auth.middleware.js");

// const router = express.Router();

// router.get("/profile", verifyFirebaseToken, (req, res) => {
//   res.json({
//     message: "Protected data accessed!",
//     user: req.user,
//   });
// });

// module.exports = router;

// routes/secure.routes.js
const express = require("express");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware.js");
const {
  registerUserDetails,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controller.js"); // ✅ ইম্পোর্ট

const router = express.Router();

// ❌ এই রুটটি আর দরকার নেই, আমরা নতুন রুট ব্যবহার করব
// router.get("/profile", verifyFirebaseToken, (req, res) => {
//   res.json({
//     message: "Protected data accessed!",
//     user: req.user,
//   });
// });

// ✅ নতুন ইউজার প্রোফাইল রুট
router.post("/register-details", verifyFirebaseToken, registerUserDetails);
router.get("/profile", verifyFirebaseToken, getUserProfile);
router.put("/profile", verifyFirebaseToken, updateUserProfile);

module.exports = router;
