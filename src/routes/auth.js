const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// TOKEN GENERATORS
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// ME
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashed,
      role: role || "buyer",
    });

    await newUser.save();

    return res.status(201).json({
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Email topilmadi" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Parol noto'g'ri" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // 🍪 COOKIE: Vercel → Render uchun to‘g‘ri sozlama
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.json({
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// REFRESH TOKEN
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token kerak" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Yaroqsiz refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Refresh token error" });
  }
});

// LOGOUT
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.refreshToken = null;
    await user.save();

    res.clearCookie("token");
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

{
  // const express = require("express");
  // const bcrypt = require("bcryptjs");
  // const jwt = require("jsonwebtoken");
  // const User = require("../models/User");
  // const { authMiddleware } = require("../middleware/authMiddleware");
  // const router = express.Router();
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: true, // HTTPS uchun majburiy
  //   sameSite: "none", // Vercel → Render uchun majburiy
  // });
  // // 🔑 Access va Refresh token yaratish funksiyalari
  // const generateAccessToken = (user) => {
  //   return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
  //     expiresIn: "1h", // qisqa muddat
  //   });
  // };
  // const generateRefreshToken = (user) => {
  //   return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
  //     expiresIn: "7d", // uzoq muddat
  //   });
  // };
  // // router.get("/me", authMiddleware, async (req, res) => {
  // //   try {
  // //     const items = await Cart.find({ userId: req.user._id });
  // //     res.json(items);
  // //   } catch (err) {
  // //     res.status(500).json({ error: err.message });
  // //   }
  // // });
  // // 📌 ME route
  // router.get("/me", authMiddleware, (req, res) => {
  //   // console.log(req);
  //   res.json(req.user); // foydalanuvchini qaytaradi (id, email, role va h.k.)
  // });
  // // 📌 Register
  // router.post("/register", async (req, res) => {
  //   try {
  //     const { fullName, email, password, role } = req.body;
  //     const existingUser = await User.findOne({ email: email.toLowerCase() });
  //     if (existingUser) {
  //       return res.status(400).json({ message: "User already exists" });
  //     }
  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const newUser = new User({
  //       fullName,
  //       email: email.toLowerCase(),
  //       password: hashedPassword,
  //       role: role || "buyer",
  //     });
  //     await newUser.save();
  //     const accessToken = generateAccessToken(newUser);
  //     const refreshToken = generateRefreshToken(newUser);
  //     newUser.refreshToken = refreshToken;
  //     await newUser.save();
  //     return res.status(201).json({
  //       accessToken,
  //       refreshToken,
  //       user: {
  //         id: newUser._id,
  //         fullName: newUser.fullName,
  //         email: newUser.email,
  //         role: newUser.role,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  // {
  //   // router.post("/register", async (req, res) => {
  //   //   try {
  //   //     const { fullName, email, password, role } = req.body;
  //   //     const existingUser = await User.findOne({ email });
  //   //     if (existingUser) {
  //   //       return res.status(400).json({ message: "User already exists" });
  //   //     }
  //   //     const salt = await bcrypt.genSalt(10);
  //   //     const hashedPassword = await bcrypt.hash(password, salt);
  //   //     const newUser = new User({
  //   //       fullName,
  //   //       email,
  //   //       password: hashedPassword,
  //   //       role: "admin",
  //   //     });
  //   //     await newUser.save();
  //   //     // 🔥 Token yaratamiz
  //   //     const token = jwt.sign(
  //   //       { id: newUser._id, email: newUser.email, role: newUser.role },
  //   //       process.env.JWT_SECRET,
  //   //       { expiresIn: "7d" }
  //   //     );
  //   //     console.log(token);
  //   //     res.status(201).json({
  //   //       message: "User registered successfully",
  //   //       token, // 🔥 Frontga token qaytyapti
  //   //       user: {
  //   //         id: newUser._id,
  //   //         fullName: newUser.fullName,
  //   //         email: newUser.email,
  //   //         role: newUser.role,
  //   //       },
  //   //     });
  //   //     // res.status(201).json({
  //   //     //   message: "User registered successfully",
  //   //     //   user: {
  //   //     //     id: newUser._id,
  //   //     //     fullName: newUser.fullName,
  //   //     //     email: newUser.email,
  //   //     //     role: newUser.role,
  //   //     //   },
  //   //     // });
  //   //   } catch (error) {
  //   //     console.error(error);
  //   //     res.status(500).json({ message: "Server error", error });
  //   //   }
  //   // });
  // }
  // // 📌 Login
  // router.post("/login", async (req, res) => {
  //   console.log(req.body);
  //   try {
  //     const { email, password } = req.body;
  //     const user = await User.findOne({ email: email.toLowerCase() });
  //     if (!user) return res.status(400).json({ message: "Email topilmadi" });
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(400).json({ message: "Parol noto'g'ri" });
  //     const accessToken = generateAccessToken(user);
  //     const refreshToken = generateRefreshToken(user);
  //     user.refreshToken = refreshToken;
  //     await user.save();
  //     return res.json({
  //       accessToken,
  //       refreshToken,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  // // 📌 Refresh Token -> Yangi Access Token olish
  // router.post("/refresh-token", async (req, res) => {
  //   const { refreshToken } = req.body;
  //   if (!refreshToken)
  //     return res.status(401).json({ message: "Refresh token kerak" });
  //   try {
  //     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  //     const user = await User.findById(decoded.id);
  //     if (!user || user.refreshToken !== refreshToken) {
  //       return res.status(403).json({ message: "Yaroqsiz refresh token" });
  //     }
  //     const newAccessToken = generateAccessToken(user);
  //     const newRefreshToken = generateRefreshToken(user);
  //     user.refreshToken = newRefreshToken;
  //     await user.save();
  //     // 🍪 Yangi tokenni cookie qilib yuboramiz
  //     res.cookie("token", newAccessToken, {
  //       httpOnly: true,
  //       secure: false,
  //       sameSite: "lax",
  //       maxAge: 15 * 60 * 1000,
  //     });
  //     res.json({ refreshToken: newRefreshToken });
  //   } catch (error) {
  //     res
  //       .status(403)
  //       .json({ message: "Yaroqsiz yoki muddati tugagan refresh token" });
  //   }
  // });
  // // 📌 Logout
  // router.post("/logout", authMiddleware, async (req, res) => {
  //   try {
  //     const user = await User.findById(req.user._id);
  //     user.refreshToken = null;
  //     await user.save();
  //     // 🍪 Cookie ni o‘chirib tashlaymiz
  //     res.clearCookie("token");
  //     res.json({ message: "Logged out" });
  //   } catch (err) {
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  // // 📌 Change Password
  // router.post("/change-password", authMiddleware, async (req, res) => {
  //   try {
  //     const { oldPassword, newPassword } = req.body;
  //     const user = await User.findById(req.user._id);
  //     const isMatch = await bcrypt.compare(oldPassword, user.password);
  //     if (!isMatch)
  //       return res.status(400).json({ message: "Eski parol noto‘g‘ri" });
  //     const salt = await bcrypt.genSalt(10);
  //     user.password = await bcrypt.hash(newPassword, salt);
  //     await user.save();
  //     res.json({ message: "Parol o‘zgartirildi" });
  //   } catch (err) {
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
  // module.exports = router;
}

{
  // router.post("/login", async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const user = await User.findOne({ email: email.toLowerCase() });
  //     console.log(user);
  //     if (!user) return res.status(400).json({ message: "Email topilmadi" });
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(400).json({ message: "Parol noto‘g‘ri" });
  //     const accessToken = generateAccessToken(user);
  //     console.log(accessToken);
  //     const refreshToken = generateRefreshToken(user);
  //     user.refreshToken = refreshToken;
  //     await user.save();
  //     // 🍪 Access tokenni cookie qilib yuboramiz
  //     res.cookie("token", accessToken, {
  //       httpOnly: true,
  //       secure: false, // https bo'lsa true
  //       sameSite: "lax",
  //       maxAge: 15 * 60 * 1000, // 15 daqiqa
  //     });
  //     res.json({
  //       accessToken,
  //       refreshToken,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
}
