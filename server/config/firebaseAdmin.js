
// const admin = require("firebase-admin");
// const serviceAccount = require("../firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;

const admin = require("firebase-admin");

// ⚠️ পরিবর্তন: ফাইল require করার বদলে এনভায়রনমেন্ট ভ্যারিয়েবল থেকে JSON স্ট্রিংটি পড়ুন
try {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccountString) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
  }

  // JSON স্ট্রিংটিকে অবজেক্টে রূপান্তর করুন
  const serviceAccount = JSON.parse(serviceAccountString);

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