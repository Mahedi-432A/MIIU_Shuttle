
const admin = require("firebase-admin");

let serviceAccount;

try {
  // const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  // if (!serviceAccountString) {
  //   throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
  // }

  // JSON স্ট্রিংটিকে অবজেক্টে রূপান্তর করুন
  // const serviceAccount = JSON.parse(serviceAccountString);

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("🌍 Production Mode: Loading Firebase config from Environment Variable...");
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } 
  else {
    console.log("💻 Development Mode: Loading Firebase config from Local JSON File...");
    try {
      serviceAccount = require("../firebase-service-account.json"); 
    } catch (fileError) {
      throw new Error("Local 'firebase-service-account.json' file not found.");
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin SDK initialized successfully.");

} catch (error) {
  console.error("❌ Firebase Admin SDK Error:", error.message);
  // প্রসেসটি বন্ধ করে দিন যাতে সার্ভার ক্র্যাশ হওয়া অবস্থায় চালু না থাকে
  process.exit(1); 
}

module.exports = admin;