const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    seatNumber: { type: Number, required: true },
    date: { type: Date, default: Date.now }, // বুকিং করার তারিখ

    // জার্নির তথ্য
    journeyFrom: { type: String },
    journeyTo: { type: String },
    journeyDate: { type: String }, // ডিসপ্লে স্ট্রিং (e.g., "15th - Nov - 2025 | Sunday")
    
    // ✅ নতুন: টাইম ম্যানেজমেন্টের জন্য (অতীত vs ভবিষ্যৎ)
    journeyTimestamp: { type: Date, required: true }, 
  },
  { timestamps: true }
);

// ✅ একই বাসে একই সিট ডুপ্লিকেট বুকিং আটকাতে
bookingSchema.index({ busId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);