const express = require("express");
const { getAllBuses } = require("../controllers/bus.controller.js");
// createBus এবং verifyFirebaseToken এখান থেকে সরানো হয়েছে

const router = express.Router();

// 🔹 সব ইউজার দেখতে পারবে (public)
router.get("/", getAllBuses);

module.exports = router;