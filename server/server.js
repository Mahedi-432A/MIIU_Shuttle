
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middlewares/error.middleware"); // ✅ Global Error Handler

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

const origin = [
  process.env.CORS_ORIGIN_STUDENT, 
  process.env.CORS_ORIGIN_ADMIN,
  "http://localhost:5173",
  "http://localhost:5174"
];

// middlewares
app.use(cors({
  origin: (origin, callback) => {
    // ! Allowing requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // ! Development: Allow ANY local network IP (starts with 192.168...) or localhost
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true); 
    }

    if (origin.indexOf(origin) !== -1) { // strict check for production could be improved but keeping simple for now
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet()); // ✅ Security Headers

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// routes
app.use("/api/secure", secureRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/", (req, res) => {
  res.send("SmartSeat API is running...");
});

// ✅ Global Error Handler (End of middleware chain)
app.use(errorHandler);

// Create HTTP + Socket server
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Socket.io logic attach
seatSocket(io);
app.set("socketio", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
