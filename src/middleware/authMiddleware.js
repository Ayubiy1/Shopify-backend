const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "Invalid user" });

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied. Admin only." });

  next();
};

const sellerMiddleware = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied. Seller only." });

  next();
};

module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };

// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   const token = req.header.authorization?.splite(" ")[1];
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//     //
//   } catch (error) {}

//   //
// };

// module.exports = authMiddleware;
