import { useEffect } from "react";
import { messaging } from "../firebase/firebase.config";
import { getToken, onMessage } from "firebase/messaging";
import { useAuth } from "../context/AuthContext";
import instance from "../utils/axiosConfig";
import toast from "react-hot-toast";

const NotificationHandler = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      requestPermission();
    }
  }, [user]); // ইউজার লগইন করলেই টোকেন রিকোয়েস্ট করুন

  // নোটিফিকেশন পারমিশন রিকোয়েস্ট এবং টোকেন সেভ
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");

        // FCM টোকেন জেনারেট করুন
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // .env ফাইল থেকে
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          // টোকেনটি আমাদের ব্যাকএন্ডে পাঠান
          await sendTokenToServer(currentToken);
        } else {
          console.log("No registration token available. Request permission.");
        }
      } else {
        console.log("Unable to get permission to show notifications.");
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  };

  // টোকেন সার্ভারে সেভ করার ফাংশন
  const sendTokenToServer = async (token) => {
    try {
      await instance.post("/secure/register-fcm-token", { token });
      console.log("FCM token sent to server successfully.");
    } catch (err) {
      console.error("Error sending FCM token to server:", err);
    }
  };

  // অ্যাপ খোলা থাকা অবস্থায় নোটিফিকেশন রিসিভ (Foreground)
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in foreground: ", payload);
      // টোস্ট নোটিফিকেশন দেখান
      toast.success(
        <div>
          <div className="font-bold">{payload.notification.title}</div>
          <div>{payload.notification.body}</div>
        </div>
      );
    });

    return () => unsubscribe();
  }, []);

  return null; // এই কম্পোনেন্টের কোনো UI নেই
};

export default NotificationHandler;
