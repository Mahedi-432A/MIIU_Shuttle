// // controllers/user.controller.js
// const User = require("../models/user.model");

// // 1. রেজিস্ট্রেশনের পর ইউজার ডিটেইলস সেভ করা
// const registerUserDetails = async (req, res) => {
//   try {
//     const { uid, email } = req.user;
//     const { fullName, mobile, studentId, department, batch, gender } = req.body;

//     // ইউজার আগে থেকেই আছে কি না চেক করুন
//     const existingUser = await User.findOne({ uid });
//     if (existingUser) {
//       return res.status(400).json({ message: "User details already exist" });
//     }

//     const newUser = new User({
//       uid,
//       email,
//       fullName,
//       mobile,
//       studentId,
//       department,
//       batch,
//       gender,
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User details saved", user: newUser });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 2. ইউজারের প্রোফাইল ইনফরমেশন ফেচ করা
// const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findOne({ uid: req.user.uid });
//     if (!user) {
//       return res.status(404).json({ message: "User profile not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 3. ইউজারের প্রোফাইল আপডেট করা
// const updateUserProfile = async (req, res) => {
//   try {
//     const { fullName, mobile, studentId, department, batch, gender } = req.body;

//     const user = await User.findOneAndUpdate(
//       { uid: req.user.uid },
//       {
//         $set: {
//           fullName,
//           mobile,
//           studentId,
//           department,
//           batch,
//           gender,
//         },
//       },
//       { new: true } // আপডেট করা ডকুমেন্টটি ফেরত দেয়
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User profile not found" });
//     }

//     res.json({ message: "Profile updated successfully", user });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// module.exports = {
//   registerUserDetails,
//   getUserProfile,
//   updateUserProfile,
// };

const User = require("../models/user.model");

// 1. রেজিস্ট্রেশনের পর ইউজার ডিটেইলস সেভ করা
const registerUserDetails = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { fullName, mobile, studentId, department, batch, gender } = req.body;

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({ message: "User details already exist" });
    }

    const newUser = new User({
      uid,
      email,
      fullName,
      mobile,
      studentId,
      department,
      batch,
      gender,
      fcmTokens: [], // ✅ খালি অ্যারে দিয়ে শুরু
    });

    await newUser.save();
    res.status(201).json({ message: "User details saved", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 2. ইউজারের প্রোফাইল ইনফরমেশন ফেচ করা
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

// 3. ইউজারের প্রোফাইল আপডেট করা
const updateUserProfile = async (req, res) => {
  try {
    const { fullName, mobile, studentId, department, batch, gender } = req.body;

    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        $set: {
          fullName,
          mobile,
          studentId,
          department,
          batch,
          gender,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 4. ✅ নতুন ফাংশন: FCM টোকেন সেভ করা
const registerFcmToken = async (req, res) => {
  try {
    const { token } = req.body;
    const { uid } = req.user;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // ইউজারকে খুঁজুন এবং টোকেনটি 'fcmTokens' অ্যারেতে যোগ করুন
    // $addToSet নিশ্চিত করে যে ডুপ্লিকেট টোকেন সেভ হবে না
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
  registerFcmToken, // ✅ এক্সপোর্ট করুন
};