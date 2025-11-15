// Firebase SDKs
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyD5S4fL3A2DCkmO44cWtirr8BMtgKJink8",
  authDomain: "miu-shuttle.firebaseapp.com",
  projectId: "miu-shuttle",
  storageBucket: "miu-shuttle.firebasestorage.app",
  messagingSenderId: "15994104507",
  appId: "1:15994104507:web:a8ec3d2bc4a633d2ef579e",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png", 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});