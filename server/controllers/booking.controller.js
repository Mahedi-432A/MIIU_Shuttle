const Booking = require("../models/booking.model");
const Bus = require("../models/bus.model");

// ✅ নতুন বুকিং তৈরি (আপডেটেড)
const createBooking = async (req, res) => {
  try {
    // ✅ journeyTimestamp ক্লায়েন্ট থেকে আসবে
    const { busId, seatNumber, journeyFrom, journeyTo, journeyDate, journeyTimestamp } = req.body;
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
      journeyTimestamp, // ✅ নতুন ফিল্ড সেভ করুন
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

// ✅ ইউজারের *আসন্ন* বুকিং (MyBookings পেজের জন্য)
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const now = new Date(); // বর্তমান সময়

    const bookings = await Booking.find({ 
      userId,
      journeyTimestamp: { $gte: now } // ✅ শুধু ভবিষ্যতের ট্রিপ
    })
      .populate("busId")
      .sort({ journeyTimestamp: 1 }); // ✅ যেটি আগে, সেটি আগে দেখাবে
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// ✅ নতুন ফাংশন: ইউজারের *অতীতের* বুকিং (History পেজের জন্য)
const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.uid;
    const now = new Date(); // বর্তমান সময়

    const history = await Booking.find({
      userId,
      journeyTimestamp: { $lt: now } // ✅ শুধু অতীতের ট্রিপ
    })
      .populate("busId")
      .sort({ journeyTimestamp: -1 }); // ✅ সর্বশেষ ট্রিপ আগে দেখাবে
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history" });
  }
};


// ...বাকি ফাংশনগুলো (getBookingsByBus, cancelBooking) আগের মতোই...
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
  getUserBookings, // এটি এখন শুধু ভবিষ্যৎ বুকিং পাঠায়
  getUserHistory,  // ✅ নতুন ফাংশন
  getBookingsByBus,
  cancelBooking,
};