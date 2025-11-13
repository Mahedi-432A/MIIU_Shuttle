// const express = require("express");
// const { createBooking, getUserBookings, cancelBooking } = require("../controllers/booking.controller");
// const { verifyFirebaseToken } = require("../middlewares/auth.middleware");

// const router = express.Router();

// router.post("/", verifyFirebaseToken, createBooking);
// router.get("/", verifyFirebaseToken, getUserBookings);
// router.delete("/:id", verifyFirebaseToken, cancelBooking);

// module.exports = router;


// routes/booking.routes.js

const express = require("express");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingsByBus, // ⭐️ নতুন কন্ট্রোলার ইম্পোর্ট করুন
} = require("../controllers/booking.controller");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// নতুন বুকিং তৈরি
router.post("/", verifyFirebaseToken, createBooking);

// নির্দিষ্ট ইউজারের সব বুকিং (প্রোফাইল পেজ)
router.get("/", verifyFirebaseToken, getUserBookings);

// ⭐️ নতুন রুট: একটি নির্দিষ্ট বাসের সব বুকড সিট
router.get("/bus/:busId", verifyFirebaseToken, getBookingsByBus);

// বুকিং ক্যানসেল
router.delete("/:id", verifyFirebaseToken, cancelBooking);

module.exports = router;