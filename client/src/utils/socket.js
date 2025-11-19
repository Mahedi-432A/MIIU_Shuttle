import { io } from "socket.io-client";

// আপনার সার্ভারের ঠিকানা
// const URL = "http://localhost:5000";
const URL = "wss://miiu-shuttle-server.onrender.com";

export const socket = io(URL, {
  transports: ["websocket"], // রিয়েল-টাইমের জন্য WebSocket prefer করা
});