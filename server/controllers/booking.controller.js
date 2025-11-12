const Booking = require("../models/booking.model");
const Bus = require("../models/bus.model");

// ✅ নতুন বুকিং তৈরি
const createBooking = async (req, res) => {
  try {
    const { busId, seatNumber } = req.body;
    const userId = req.user.uid;

    // সিট আগে থেকে বুক করা আছে কি না চেক করো
    const existing = await Booking.findOne({ busId, seatNumber });
    if (existing) return res.status(400).json({ message: "Seat already booked!" });

    const booking = await Booking.create({ userId, busId, seatNumber });

    // Bus collection এ available seat update
    await Bus.findByIdAndUpdate(busId, { $inc: { availableSeats: -1 } });

    res.status(201).json({ message: "Seat booked successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

// ✅ ইউজারের সব বুকিং
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const bookings = await Booking.find({ userId }).populate("busId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
};
