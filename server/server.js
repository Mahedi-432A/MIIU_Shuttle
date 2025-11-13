
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db.js");

const secureRoutes = require("./routes/secure.routes.js");
const busRoutes = require("./routes/bus.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");

const adminRoutes = require("./routes/admin.routes.js");
const noticeRoutes = require("./routes/notice.routes.js");

const seatSocket = require("./sockets/seat.socket.js");


dotenv.config();
const app = express();
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/secure", secureRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/", (req, res) => {
  res.send("SmartSeat API is running...");
});

// Create HTTP + Socket server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Socket.io logic attach
seatSocket(io);
app.set("socketio", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
