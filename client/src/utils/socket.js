import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(URL, {
  transports: ["websocket"], // রিয়েল-টাইমের জন্য WebSocket prefer করা
});