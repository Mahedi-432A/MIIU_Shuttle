const express = require("express");
const { findBuses, getBusRoutes } = require("../controllers/bus.controller.js");

const router = express.Router();

// 🔹 বাস খোঁজার রুট (আপডেটেড)
router.get("/", findBuses);

// 🔹 ✅ নতুন রুট: Autocomplete সাজেশন
router.get("/routes", getBusRoutes);

module.exports = router;