const express = require("express");
const { verifyFirebaseToken } = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/profile", verifyFirebaseToken, (req, res) => {
  res.json({
    message: "Protected data accessed!",
    user: req.user,
  });
});

module.exports = router;
