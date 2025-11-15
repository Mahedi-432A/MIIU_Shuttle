// const Booking = require("../models/booking.model");
// const Bus = require("../models/bus.model");

// // ✅ নতুন বুকিং তৈরি ()
// const createBooking = async (req, res) => {
//   try {
//     const { busId, seatNumber, journeyFrom, journeyTo, journeyDate } = req.body;
//     const userId = req.user.uid;

//     // সিট আগে থেকে বুক করা আছে কি না চেক করো
//     const existing = await Booking.findOne({ busId, seatNumber });
//     if (existing) {
//       return res.status(400).json({ message: "Seat already booked!" });
//     }

//     const booking = await Booking.create({
//       userId,
//       busId,
//       seatNumber,
//       journeyFrom,
//       journeyTo,
//       journeyDate,
//     });

//     // Bus collection এ available seat update
//     await Bus.findByIdAndUpdate(busId, { $inc: { availableSeats: -1 } });

//     // --- Socket.io ইন্টিগ্রেশন ---
//     const io = req.app.get("socketio");
//     const updateData = {
//       busId: busId,
//       seatNumber: seatNumber,
//       bookedBy: req.user.uid,
//     };

//     io.to(busId).emit("seatStatusUpdate", updateData);
//     // --- Socket.io ইন্টিগ্রেশন শেষ ---

//     res.status(201).json({ message: "Seat booked successfully", booking });
//   } catch (err) {
//     res.status(500).json({ message: "Booking failed", error: err.message });
//   }
// };

// // ✅ ইউজারের *সব* বুকিং (প্রোফাইল পেজের জন্য)
// const getUserBookings = async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     // populate('busId') যোগ করা হয়েছে যাতে বাসের নামও সাথে আসে
//     const bookings = await Booking.find({ userId }).populate("busId");
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching bookings" });
//   }
// };

// // ⭐️ ✅ একটি নির্দিষ্ট বাসের সব বুকড সিট
// const getBookingsByBus = async (req, res) => {
//   try {
//     const { busId } = req.params;
//     const bookings = await Booking.find({ busId });
//     const seatNumbers = bookings.map((b) => b.seatNumber);
//     res.json(seatNumbers);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching bus bookings" });
//   }
// };

// // বুকিং ক্যানসেল করো
// const cancelBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     await Bus.findByIdAndUpdate(booking.busId, { $inc: { availableSeats: 1 } });
//     await Booking.findByIdAndDelete(bookingId);

//     // --- Socket.io ইন্টিগ্রেশন ---
//     const io = req.app.get("socketio");
//     const updateData = {
//       busId: booking.busId,
//       seatNumber: booking.seatNumber,
//     };

//     io.to(booking.busId.toString()).emit("seatCancelledUpdate", updateData);
//     // --- Socket.io ইন্টিগ্রেশন শেষ ---

//     res.json({ message: "Booking cancelled successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Cancel failed", error: err.message });
//   }
// };

// module.exports = {
//   createBooking,
//   getUserBookings,
//   getBookingsByBus,
//   cancelBooking,
// };

const Booking = require("../models/booking.model");
const Bus = require("../models/bus.model");

// ... createBooking ...
const createBooking = async (req, res) => {
  try {
    const { busId, seatNumber, journeyFrom, journeyTo, journeyDate } = req.body;
    const userId = req.user.uid;

    const existing = await Booking.findOne({ busId, seatNumber });
    if (existing) {
      return res.status(400).json({ message: "Seat already booked!" });
    }
    const booking = await Booking.create({
      userId,
      busId,
      seatNumber,
      journeyFrom,
      journeyTo,
      journeyDate,
    });
    await Bus.findByIdAndUpdate(busId, { $inc: { availableSeats: -1 } });

    const io = req.app.get("socketio");
    const updateData = {
      busId: busId,
      seatNumber: seatNumber,
      bookedBy: req.user.uid,
    };
    io.to(busId).emit("seatStatusUpdate", updateData);
    res.status(201).json({ message: "Seat booked successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};


// ✅ ইউজারের *সব* বুকিং (আপডেটেড: সর্বশেষ আগে)
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const bookings = await Booking.find({ userId })
      .populate("busId")
      .sort({ createdAt: -1 }); // ✅ সর্বশেষ বুকিং আগে দেখাবে
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// ... getBookingsByBus and cancelBooking ...
const getBookingsByBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const bookings = await Booking.find({ busId });
    const seatNumbers = bookings.map((b) => b.seatNumber);
    res.json(seatNumbers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bus bookings" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await Bus.findByIdAndUpdate(booking.busId, { $inc: { availableSeats: 1 } });
    await Booking.findByIdAndDelete(bookingId);
    const io = req.app.get("socketio");
    const updateData = {
      busId: booking.busId,
      seatNumber: booking.seatNumber,
    };
    io.to(booking.busId.toString()).emit("seatCancelledUpdate", updateData);
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