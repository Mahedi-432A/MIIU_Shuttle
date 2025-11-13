const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    seatNumber: { type: Number, required: true },
    date: { type: Date, default: Date.now },

    journeyFrom: { type: String },
    journeyTo: { type: String },
    journeyDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);