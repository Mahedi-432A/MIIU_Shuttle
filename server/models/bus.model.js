const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busName: { type: String, required: true },
    routeFrom: { type: String, required: true },
    routeTo: { type: String, required: true },
    time: { type: String, required: true },
    totalSeats: { type: Number, default: 40 },
    availableSeats: { type: Number, default: 40 },
    driverName: { type: String },
    driverContact: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
