const express = require("express");
const { createBooking, getUserBookings, cancelBooking } = require("../controllers/booking.controller");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", verifyFirebaseToken, createBooking);
router.get("/", verifyFirebaseToken, getUserBookings);
router.delete("/:id", verifyFirebaseToken, cancelBooking);

module.exports = router;
