// const Booking = require("../models/booking.model");
// const Bus = require("../models/bus.model");

// // ✅ নতুন বুকিং তৈরি
// const createBooking = async (req, res) => {
//   try {
//     const { busId, seatNumber } = req.body;
//     const userId = req.user.uid;

//     // সিট আগে থেকে বুক করা আছে কি না চেক করো
//     const existing = await Booking.findOne({ busId, seatNumber });
//     if (existing) return res.status(400).json({ message: "Seat already booked!" });

//     const booking = await Booking.create({ userId, busId, seatNumber });

//     // Bus collection এ available seat update
//     await Bus.findByIdAndUpdate(busId, { $inc: { availableSeats: -1 } });

//     res.status(201).json({ message: "Seat booked successfully", booking });
//   } catch (err) {
//     res.status(500).json({ message: "Booking failed", error: err.message });
//   }
// };

// // ✅ ইউজারের সব বুকিং
// const getUserBookings = async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const bookings = await Booking.find({ userId }).populate("busId");
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching bookings" });
//   }
// };

// // বুকিং ক্যানসেল করো
// const cancelBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const booking = await Booking.findById(bookingId);

//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     // সিট আবার available করো
//     await Bus.findByIdAndUpdate(booking.busId, { $inc: { availableSeats: 1 } });

//     await Booking.findByIdAndDelete(bookingId);

//     res.json({ message: "Booking cancelled successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Cancel failed", error: err.message });
//   }
// };

// module.exports = {
//   createBooking,
//   getUserBookings,
//   cancelBooking,
// };


// controllers/booking.controller.js

// controllers/booking.controller.js

const Booking = require("../models/booking.model");
const Bus = require("../models/bus.model");

// ✅ নতুন বুকিং তৈরি
const createBooking = async (req, res) => {
  try {
    const { busId, seatNumber } = req.body;
    const userId = req.user.uid; // আপনার auth middleware অনুযায়ী

    // সিট আগে থেকে বুক করা আছে কি না চেক করো
    const existing = await Booking.findOne({ busId, seatNumber });
    if (existing) {
      return res.status(400).json({ message: "Seat already booked!" });
    }

    const booking = await Booking.create({ userId, busId, seatNumber });

    // Bus collection এ available seat update
    await Bus.findByIdAndUpdate(busId, { $inc: { availableSeats: -1 } });

    // --- Socket.io ইন্টিগ্রেশন ---
    const io = req.app.get("socketio");
    const updateData = {
      busId: busId,
      seatNumber: seatNumber,
      bookedBy: req.user.uid,
    };

    io.to(busId).emit("seatStatusUpdate", updateData);
    // --- Socket.io ইন্টিগ্রেশন শেষ ---

    res.status(201).json({ message: "Seat booked successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};

// ✅ ইউজারের *সব* বুকিং (প্রোফাইল পেজের জন্য)
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const bookings = await Booking.find({ userId }).populate("busId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// ⭐️ ✅ নতুন ফাংশন: একটি নির্দিষ্ট বাসের সব বুকড সিট
const getBookingsByBus = async (req, res) => {
  try {
    const { busId } = req.params;
    // শুধু ঐ বাসের বুকিংগুলো খুঁজুন
    const bookings = await Booking.find({ busId });
    
    // ক্লায়েন্টকে শুধু সিট নম্বরগুলো পাঠান
    const seatNumbers = bookings.map((b) => b.seatNumber);
    res.json(seatNumbers);

  } catch (err) {
    res.status(500).json({ message: "Error fetching bus bookings" });
  }
};

// বুকিং ক্যানসেল করো
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Bus.findByIdAndUpdate(booking.busId, { $inc: { availableSeats: 1 } });
    await Booking.findByIdAndDelete(bookingId);

    // --- Socket.io ইন্টিগ্রেশন ---
    const io = req.app.get("socketio");
    const updateData = {
      busId: booking.busId,
      seatNumber: booking.seatNumber,
    };

    io.to(booking.busId.toString()).emit("seatCancelledUpdate", updateData);
    // --- Socket.io ইন্টিগ্রেশন শেষ ---

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Cancel failed", error: err.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingsByBus,
  cancelBooking,
};