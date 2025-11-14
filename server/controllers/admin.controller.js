
// const Bus = require("../models/bus.model.js");
// const Notice = require("../models/notice.model.js");

// // === বাস ===
// // 1. নতুন বাস তৈরি
// const createBus = async (req, res) => {
//   try {
//     const bus = new Bus(req.body);
//     await bus.save();
//     res.status(201).json({ message: "Bus added successfully" });
//   } catch (err) {
//     res.status(400).json({ message: "Error adding bus", error: err.message });
//   }
// };

// // 2. সব বাস (অ্যাডমিন প্যানেলের জন্য)
// const getAllBuses = async (req, res) => {
//   try {
//     const buses = await Bus.find();
//     res.status(200).json(buses);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching buses" });
//   }
// };

// // 3. বাস আপডেট
// const updateBus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedBus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedBus) return res.status(404).json({ message: "Bus not found" });
//     res.status(200).json({ message: "Bus updated", bus: updatedBus });
//   } catch (err) {
//     res.status(400).json({ message: "Error updating bus", error: err.message });
//   }
// };

// // 4. বাস ডিলিট
// const deleteBus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedBus = await Bus.findByIdAndDelete(id);
//     if (!deletedBus) return res.status(404).json({ message: "Bus not found" });
//     res.status(200).json({ message: "Bus deleted" });
//   } catch (err) {
//     res.status(400).json({ message: "Error deleting bus", error: err.message });
//   }
// };

// // === নোটিশ ===

// // 1. নতুন নোটিশ তৈরি (✅ আপডেটেড)
// const createNotice = async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const newNotice = new Notice({
//       title,
//       content,
//       author: req.user.uid, // কোন অ্যাডমিন পোস্ট করেছে
//     });
//     await newNotice.save();

//     // --- 🚀 Socket.io রিয়েল-টাইম আপডেট ---
//     const io = req.app.get("socketio");
//     // 'newNotice' ইভেন্টটি সব কানেক্টেড ক্লায়েন্টকে পাঠান
//     // আমরা সর্বশেষ নোটিশটি পাঠাচ্ছি (এটি Home পেজের জন্য)
//     io.emit("newNotice", newNotice);
//     // --- 🚀 Socket.io রিয়েল-টাইম আপডেট শেষ ---

//     res.status(201).json({ message: "Notice posted", notice: newNotice });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to post notice", error: err.message });
//   }
// };

// // 2. সব নোটিশ (অ্যাডমিন প্যানেলের জন্য)
// const getAllNotices = async (req, res) => {
//   try {
//     // নতুনগুলো আগে দেখানোর জন্য sort
//     const notices = await Notice.find().sort({ createdAt: -1 });
//     res.status(200).json(notices);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching notices" });
//   }
// };

// module.exports = {
//   createBus,
//   getAllBuses,
//   updateBus,
//   deleteBus,
//   createNotice,
//   getAllNotices,
// };

const Bus = require("../models/bus.model.js");
const Notice = require("../models/notice.model.js");
const User = require("../models/user.model.js");
const admin = require("../config/firebaseAdmin"); // ✅ Firebase Admin ইম্পোর্ট করুন

// === হেলপার ফাংশন: পুশ নোটিফিকেশন পাঠানো ===
async function sendPushNotification(title, body) {
  try {
    // সব ইউজারকে খুঁজুন যাদের fcmToken আছে
    const usersWithTokens = await User.find({ fcmTokens: { $exists: true, $ne: [] } });
    
    const tokens = [];
    usersWithTokens.forEach(user => {
      tokens.push(...user.fcmTokens);
    });

    if (tokens.length === 0) {
      console.log("No FCM tokens found to send notification.");
      return;
    }

    // নোটিফিকেশনPayload
    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens, // সব টোকেনের অ্যারে
    };

    // FCM-এ মেসেজ পাঠান
    await admin.messaging().sendMulticast(message);
    console.log("Push notifications sent successfully.");

  } catch (error) {
    console.error("Error sending push notifications:", error);
  }
}

// === বাস ===
const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    
    // ✅ পুশ নোটিফিকেশন পাঠান
    await sendPushNotification(
      "New Bus Added",
      `${bus.busName} (${bus.routeFrom} to ${bus.routeTo}) is now available.`
    );

    res.status(201).json({ message: "Bus added successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error adding bus", error: err.message });
  }
};

const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBus) return res.status(404).json({ message: "Bus not found" });

    // ✅ পুশ নোটিফিকেশন পাঠান
    await sendPushNotification(
      "Bus Route Updated",
      `${updatedBus.busName} route details have been updated.`
    );

    res.status(200).json({ message: "Bus updated", bus: updatedBus });
  } catch (err) {
    res.status(400).json({ message: "Error updating bus", error: err.message });
  }
};

const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBus = await Bus.findByIdAndDelete(id);
    if (!deletedBus) return res.status(404).json({ message: "Bus not found" });
    
    // ✅ পুশ নোটিফিকেশন পাঠান
    await sendPushNotification(
      "Bus Removed",
      `${deletedBus.busName} is no longer available.`
    );
    
    res.status(200).json({ message: "Bus deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting bus", error: err.message });
  }
};

// === নোটিশ ===
const createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNotice = new Notice({
      title,
      content,
      author: req.user.uid,
    });
    await newNotice.save();

    // Socket.io রিয়েল-টাইম আপডেট (অ্যাপ খোলা থাকলে)
    const io = req.app.get("socketio");
    io.emit("newNotice", newNotice);

    // ✅ পুশ নোটিফিকেশন (অ্যাপ বন্ধ থাকলেও)
    await sendPushNotification(
      `New Announcement: ${title}`,
      content.substring(0, 100) + "..." // কন্টেন্টের প্রথম ১০০ অক্ষর
    );

    res.status(201).json({ message: "Notice posted", notice: newNotice });
  } catch (err) {
    res.status(500).json({ message: "Failed to post notice", error: err.message });
  }
};

// ...বাকি কন্ট্রোলার ফাংশনগুলো (getAllBuses, getAllNotices)...
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buses" });
  }
};

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