const User = require("../models/user.model");

// 1. রেজিস্ট্রেশনের পর ইউজার ডিটেইলস সেভ করা (✅ আপডেটেড)
const registerUserDetails = async (req, res) => {
  try {
    const { uid, email } = req.user;
    // role এবং roleSpecific তথ্য ক্লায়েন্ট থেকে আসবে
    const { fullName, mobile, gender, role, roleSpecific } = req.body;

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: "User details already exist" });
    }

    const newUser = new User({
      uid,
      email,
      fullName,
      mobile,
      gender,
      role, // ✅ নতুন
      roleSpecific, // ✅ নতুন
      fcmTokens: [],
    });

    await newUser.save();
    res.status(201).json({ message: "User details saved", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. ইউজারের প্রোফাইল ইনফরমেশন ফেচ করা (আগের মতোই)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3. ইউজারের প্রোফাইল আপডেট করা (✅ আপডেটেড)
const updateUserProfile = async (req, res) => {
  try {
    // এখানে role আপডেট করার সুবিধা নেই, শুধু ভেতরের তথ্য
    const { fullName, mobile, gender, roleSpecific } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $set: {
          fullName,
          mobile,
          gender,
          roleSpecific, // ✅ নতুন
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json({ message: "Profile updated successfully", user });
  } catch (err)
{
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 4. FCM টোকেন সেভ করা (আগের মতোই)
const registerFcmToken = async (req, res) => {
  try {
    const { token } = req.body;
    const { uid } = req.user;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    await User.findOneAndUpdate(
      { uid },
      { $addToSet: { fcmTokens: token } }
    );
    res.status(200).json({ message: "FCM token registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering FCM token", error: err.message });
  }
};

module.exports = {
  registerUserDetails,
  getUserProfile,
  updateUserProfile,
  registerFcmToken,
};