const Bus = require("../models/bus.model.js");

// 📌 সব বাস দেখানোর জন্য (স্টুডেন্টদের জন্য)
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buses" });
  }
};


module.exports = { getAllBuses };