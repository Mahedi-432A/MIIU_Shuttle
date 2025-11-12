const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    seatNumber: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
