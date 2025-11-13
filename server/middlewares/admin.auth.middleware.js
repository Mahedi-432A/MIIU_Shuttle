const admin = require("../config/firebaseAdmin");

async function verifyAdminToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // ✅ অ্যাডমিন চেক
    if (decoded.admin !== true) {
      return res
        .status(403)
        .json({ message: "Forbidden: Requires admin access" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = { verifyAdminToken };