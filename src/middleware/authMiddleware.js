const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // "Bearer token" → token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("DECODED:", decoded);

    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Invalid user" });

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

// Admin

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer token" → token

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("DECODED:", decoded);

  const user = await User.findById(decoded.id);

  if (!user) return res.status(401).json({ message: "Invalid user" });

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Kirish uchun ruxsat yo‘q!!!" });
  }
  next();
};

// Seller
const sellerMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer token" → token

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("DECODED:", decoded);

  const user = await User.findById(decoded.id);

  if (!user) return res.status(401).json({ message: "Invalid user" });

  if (user.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Ruxsat yo‘q. Faqat seller kirishi mumkin." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };
