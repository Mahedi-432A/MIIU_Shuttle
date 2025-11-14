// // models/user.model.js
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
    studentId: { type: String },
    department: { type: String },
    batch: { type: String },
    gender: { type: String },
    
    fcmTokens: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);