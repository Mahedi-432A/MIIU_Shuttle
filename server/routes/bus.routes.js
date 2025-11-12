const express = require("express");
const { getAllBuses, createBus } = require("../controllers/bus.controller.js");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware.js");

const router = express.Router();

// 🔹 সব ইউজার দেখতে পারবে (public)
router.get("/", getAllBuses);

// 🔹 শুধুমাত্র verified ইউজার বা admin add করতে পারবে
router.post("/", verifyFirebaseToken, createBus);

module.exports = router;
