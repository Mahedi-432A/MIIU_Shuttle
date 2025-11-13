const Bus = require("../models/bus.model.js");
const Notice = require("../models/notice.model.js");
const User = require("../models/user.model.js");
// const { sendNotificationToAll } = require("../utils/fcm"); // ⚠️ ধাপ ৩ এর জন্য

// === বাস ম্যানেজমেন্ট ===

// 1. নতুন বাস তৈরি
const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    // ⚠️ TODO: ধাপ ৩ এ আমরা এখানে নোটিফিকেশন পাঠাবো
    // await sendNotificationToAll("New Bus Added", `${bus.busName} is now available.`);
    res.status(201).json({ message: "Bus added successfully", bus });
  } catch (err) {
    res.status(400).json({ message: "Error adding bus", error: err.message });
  }
};

// 2. সব বাস দেখুন (অ্যাডমিন প্যানেলের জন্য)
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buses" });
  }
};

// 3. বাস আপডেট করুন
const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    // ⚠️ TODO: ধাপ ৩ এ আমরা এখানে নোটিফিকেশন পাঠাবো
    res.json({ message: "Bus updated successfully", bus });
  } catch (err) {
    res.status(400).json({ message: "Error updating bus", error: err.message });
  }
};

// 4. বাস ডিলিট করুন
const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findByIdAndDelete(id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    // ⚠️ TODO: ধাপ ৩ এ আমরা এখানে নোটিফিকেশন পাঠাবো
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting bus", error: err.message });
  }
};

// === নোটিশ ম্যানেজমেন্ট ===

// 1. নতুন নোটিশ তৈরি
const createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = new Notice({ title, content, author: req.user.name });
    await notice.save();
    // ⚠️ TODO: ধাপ ৩ এ আমরা এখানে নোটিফিকেশন পাঠাবো
    // await sendNotificationToAll(`New Announcement: ${title}`, content);
    res.status(201).json({ message: "Notice posted successfully", notice });
  } catch (err) {
    res.status(400).json({ message: "Error posting notice", error: err.message });
  }
};

// 2. সব নোটিশ দেখুন (অ্যাডমিন প্যানেলের জন্য)
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notices" });
  }
};

module.exports = {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
  createNotice,
  getAllNotices,
};