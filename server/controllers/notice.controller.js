const Notice = require("../models/notice.model.js");

// 1. সর্বশেষ নোটিশ (হোম পেজের জন্য)
const getLatestNotice = async (req, res) => {
  try {
    const latestNotice = await Notice.findOne().sort({ createdAt: -1 });
    res.status(200).json(latestNotice);
  } catch (err) {
    res.status(500).json({ message: "Error fetching latest notice" });
  }
};

// 2. সব নোটিশ (নোটিফিকেশন পেজের জন্য)
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notices" });
  }
};

module.exports = {
  getLatestNotice,
  getAllNotices,
};