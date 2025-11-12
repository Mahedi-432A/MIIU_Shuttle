const Bus = require("../models/bus.model.js");

// 📌 সব বাস দেখানোর জন্য
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buses" });
  }
};

// 📌 নতুন বাস যোগ করার জন্য (Admin future use)
const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json({ message: "Bus added successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error adding bus" });
  }
};

module.exports = { getAllBuses, createBus };
