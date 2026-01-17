const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Authorization header tekshirish
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token mavjud emas",
      });
    }

    // 2️⃣ Token ajratib olish
    const token = authHeader.split(" ")[1];

    // 3️⃣ Tokenni tekshirish
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ User topish
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User topilmadi",
      });
    }

    // 5️⃣ Requestga user biriktirish
    req.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      additionId: user.additionId || null,
    };

    // 6️⃣ Keyingi middleware / controller ga o‘tish
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token yaroqsiz yoki eskirgan",
    });
  }
};

const authMiddlewarae = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
// Admin
const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1]; // "Bearer token" → token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
  // const seller = await User.findById({ additionId: decoded.id.toString() });
  const user = await User.findById(decoded.id);
  // console.log(decoded.id);
  const seller = await Seller.findById(user.additionId);
  if (!seller) return res.status(401).json({ message: "Invalid seller" });
  // console.log(seller);
  if (seller.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Ruxsat yo‘q. Faqat seller kirishi mumkin." });
  }
  next();
};

module.exports = {
  authMiddleware,
  sellerMiddleware,
  adminMiddleware,
};

{
  // const jwt = require("jsonwebtoken");
  // const User = require("../models/User");
  // const Seller = require("../models/Seller");
  // const authMiddleware = async (req, res, next) => {
  //   try {
  //     const authHeader = req.headers.authorization;
  //     if (!authHeader)
  //       return res.status(401).json({ message: "No token provided" });
  //     const token = authHeader.split(" ")[1]; // "Bearer token" → token
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     const user = await User.findById(decoded.id);
  //     if (!user) return res.status(401).json({ message: "Invalid user" });
  //     req.user = user;
  //     next();
  //   } catch (error) {
  //     return res
  //       .status(401)
  //       .json({ message: "Unauthorized", error: error.message });
  //   }
  // };
  // const authMiddlewarae = (req, res, next) => {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({ message: "No token provided" });
  //   }
  //   const token = authHeader.split(" ")[1];
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     req.user = decoded; // { _id, role, ... }
  //     next();
  //   } catch (err) {
  //     return res.status(401).json({ message: "Token invalid" });
  //   }
  // };
  // // Admin
  // const adminMiddleware = async (req, res, next) => {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader)
  //     return res.status(401).json({ message: "No token provided" });
  //   const token = authHeader.split(" ")[1]; // "Bearer token" → token
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.id);
  //   if (!user) return res.status(401).json({ message: "Invalid user" });
  //   if (user.role !== "admin") {
  //     return res.status(403).json({ message: "Kirish uchun ruxsat yo‘q!!!" });
  //   }
  //   next();
  // };
  // // Seller
  // const sellerMiddleware = async (req, res, next) => {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader)
  //     return res.status(401).json({ message: "No token provided" });
  //   const token = authHeader.split(" ")[1]; // "Bearer token" → token
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   // const seller = await User.findById({ additionId: decoded.id.toString() });
  //   const user = await User.findById(decoded.id);
  //   // console.log(decoded.id);
  //   const seller = await Seller.findById(user.additionId);
  //   if (!seller) return res.status(401).json({ message: "Invalid seller" });
  //   // console.log(seller);
  //   if (seller.role !== "seller") {
  //     return res
  //       .status(403)
  //       .json({ message: "Ruxsat yo‘q. Faqat seller kirishi mumkin." });
  //   }
  //   next();
  // };
  // module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };
}
