const express = require("express");
const {
  getAllNotices,
  getLatestNotice,
} = require("../controllers/notice.controller.js");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware.js");

const router = express.Router();

// Middleware: স্টুডেন্টদের অবশ্যই লগইন করা থাকতে হবে
router.use(verifyFirebaseToken);

// সব নোটিশ (নোটিফিকেশন পেজের জন্য)
router.get("/", getAllNotices);

// সর্বশেষ নোটিশ (হোম পেজের জন্য)
router.get("/latest", getLatestNotice);

module.exports = router;