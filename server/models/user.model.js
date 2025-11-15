
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     uid: { type: String, required: true, unique: true }, // Firebase UID
//     email: { type: String, required: true, unique: true },
//     fullName: { type: String, required: true },
//     mobile: { type: String, required: true },
//     studentId: { type: String },
//     department: { type: String },
//     batch: { type: String },
//     gender: { type: String },
    
//     fcmTokens: [{ type: String }],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true }, // Firebase UID
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String },
    
    // ✅ নতুন: ইউজার রোল
    role: {
      type: String,
      enum: ["Student", "Faculty", "Stuff"],
      required: true,
    },
    
    // ✅ নতুন: রোলের উপর ভিত্তি করে আলাদা তথ্য
    roleSpecific: {
      studentId: { type: String },
      department: { type: String },
      batch: { type: String },
      facultyId: { type: String },
      designation: { type: String },
      stuffId: { type: String },
    },
    
    fcmTokens: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);