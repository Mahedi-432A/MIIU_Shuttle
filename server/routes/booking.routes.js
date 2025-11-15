const express = require("express");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingsByBus,
  getUserHistory, // ✅ ইম্পোর্ট
} = require("../controllers/booking.controller");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", verifyFirebaseToken, createBooking);
router.get("/", verifyFirebaseToken, getUserBookings); 
router.get("/bus/:busId", verifyFirebaseToken, getBookingsByBus);
router.delete("/:id", verifyFirebaseToken, cancelBooking);

// ✅ নতুন রুট: ট্রিপ হিস্ট্রি
router.get("/history", verifyFirebaseToken, getUserHistory);

module.exports = router;