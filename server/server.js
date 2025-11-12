// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const morgan = require("morgan");
// const userRoutes = require("./routes/user.routes.js");
// const busRoutes = require("./routes/bus.routes.js");
// const bookingRoutes = require("./routes/booking.routes.js");

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// // routes
// app.use("/api/users", userRoutes);
// app.use("/api/buses", busRoutes);
// app.use("/api/bookings", bookingRoutes);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const secureRoutes = require("./routes/secure.routes.js");
const busRoutes = require("./routes/bus.routes.js");
const bookingRoutes = require("./routes/booking.routes.js");


dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/secure", secureRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("SmartSeat API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
