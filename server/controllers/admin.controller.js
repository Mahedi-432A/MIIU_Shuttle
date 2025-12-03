const Bus = require("../models/bus.model.js");
const Notice = require("../models/notice.model.js");
const User = require("../models/user.model.js");
const admin = require("../config/firebaseAdmin");

// === হেলপার ফাংশন: পুশ নোটিফিকেশন পাঠানো (✅ আপডেটেড) ===
async function sendPushNotification(title, body) {
  try {
    console.log("[FCM DEBUG] 1. Starting sendPushNotification...");

    const usersWithTokens = await User.find({ fcmTokens: { $exists: true, $ne: [] } });
    
    const tokens = [];
    usersWithTokens.forEach(user => {
      tokens.push(...user.fcmTokens);
    });

    console.log(`[FCM DEBUG] 2. Found ${tokens.length} total tokens.`);

    if (tokens.length === 0) {
      console.log("[FCM DEBUG] No tokens found. Skipping notification.");
      return;
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens,
    };

    console.log("[FCM DEBUG] 3. Sending message to Firebase Admin...");

    // ⚠️⚠️⚠️ পরিবর্তনটি এখানে ⚠️⚠️⚠️
    // .sendMulticast() এর বদলে .sendEachForMulticast() হবে
    const response = await admin.messaging().sendEachForMulticast(message);
    // ⚠️⚠️⚠️ পরিবর্তন শেষ ⚠️⚠️⚠️
    
    console.log("[FCM DEBUG] 4. Firebase response:", response);

    if (response.failureCount > 0) {
      response.responses.forEach(resp => {
        if (!resp.success) {
          console.error("[FCM ERROR] Failed to send to a token:", resp.error);
        }
      });
    }

  } catch (error) {
    console.error("[FCM FATAL ERROR] Error sending push notifications:", error);
  }
}

// === বাস ===
const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    
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
    
    await sendPushNotification(
      "Bus Removed",
      `${deletedBus.busName} is no longer available.`
    );
    
    res.status(200).json({ message: "Bus deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting bus", error: err.message });
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

    const io = req.app.get("socketio");
    io.emit("newNotice", newNotice);

    await sendPushNotification(
      `New Announcement: ${title}`,
      content.substring(0, 100) + "..."
    );

    res.status(201).json({ message: "Notice posted", notice: newNotice });
  } catch (err) {
    res.status(500).json({ message: "Failed to post notice", error: err.message });
  }
};

// ...বাকি কন্ট্রোলার ফাংশনগুলো...
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