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

    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "Invalid user" });

    console.log(user);

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

// const authMiddleware = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) return res.status(401).json({ message: "Token topilmadi" });

//   try {
//     // Tokenni tekshirish
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // decoded ichida userId bo‘lishi kerak
//     req.user = await User.findById(decoded.userId).select("-password");

//     if (!req.user) {
//       return res.status(401).json({ message: "Foydalanuvchi topilmadi" });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Xato token" });
//   }
// };

// Admin

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Ruxsat yo‘q. Faqat admin kirishi mumkin." });
  }
  next();
};

// Seller
const sellerMiddleware = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Ruxsat yo‘q. Faqat seller kirishi mumkin." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };
