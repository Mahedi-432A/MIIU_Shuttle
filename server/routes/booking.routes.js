const express = require("express");
const { createBooking, getUserBookings } = require("../controllers/booking.controller");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", verifyFirebaseToken, createBooking);
router.get("/", verifyFirebaseToken, getUserBookings);

module.exports = router;
