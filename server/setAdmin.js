const admin = require("./config/firebaseAdmin");

// এখানে অ্যাডমিন বানাতে চান এমন ইউজারের ইমেইল দিন
const email = "mbsspiw2@gmail.com"; // ⚠️ পরিবর্তন করুন

const setAdmin = async () => {
  try {
    console.log(`Finding user: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);

    if (user.customClaims && user.customClaims.admin === true) {
      console.log(`User ${email} is already an admin.`);
      return;
    }

    // Custom claim সেট করুন
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Success! ${email} has been made an admin.`);
    console.log("Please restart the server if it is running.");
  } catch (err) {
    console.error("❌ Error setting custom claim:", err.message);
  }
  process.exit();
};

setAdmin();