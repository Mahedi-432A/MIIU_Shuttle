// Firebase SDKs
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// আপনার Firebase কনফিগ (firebase.config.js থেকে হুবহু কপি)
const firebaseConfig = {
  apiKey: "AIzaSyD5S4fL3A2DCkmO44cWtirr8BMtgKJink8",
  authDomain: "miu-shuttle.firebaseapp.com",
  projectId: "miu-shuttle",
  storageBucket: "miu-shuttle.firebasestorage.app",
  messagingSenderId: "15994104507",
  appId: "1:15994104507:web:a8ec3d2bc4a633d2ef579e",
};

// ⚠️ எச்சரிக்கை: উপরের কনফিগটি আপনার .env ফাইল থেকে VITE_ ভেরিয়েবলগুলো দিয়ে
// ম্যানুয়ালি রিপ্লেস করতে হবে। সার্ভিস ওয়ার্কার import.meta.env অ্যাক্সেস করতে পারে না।

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ব্যাকগ্রাউন্ডে নোটিফিকেশন হ্যান্ডেল করা
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png", // public ফোল্ডারে একটি আইকন রাখবেন
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});