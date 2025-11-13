const express = require("express");
const {
  createBus,
  getAllBuses,
  updateBus,
  deleteBus,
  createNotice,
  getAllNotices,
} = require("../controllers/admin.controller.js");
const { verifyAdminToken } = require("../middlewares/admin.auth.middleware.js");

const router = express.Router();

//  Middleware: এই ফাইলের সব রুট অ্যাডমিন-অনলি
router.use(verifyAdminToken);

// === বাস রুট ===
router.post("/bus", createBus);
router.get("/buses", getAllBuses); // অ্যাডমিন প্যানেলের জন্য
router.put("/bus/:id", updateBus);
router.delete("/bus/:id", deleteBus);

// === নোটিশ রুট ===
router.post("/notice", createNotice);
router.get("/notices", getAllNotices); // অ্যাডমিন প্যানেলের জন্য

module.exports = router;