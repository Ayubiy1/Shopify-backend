const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Cookie orqali token yuborish
const sendToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // agar HTTPS bo‘lsa true qiling
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
  });

  res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email va parol kerak" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email ro‘yxatdan o‘tgan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || "buyer", // default buyer
    });

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // foydalanuvchini tekshirish ...
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // tokenlar yaratish
  const accessToken = generateAccessToken(user._id);
  // console.log(accessToken);

  const refreshToken = generateRefreshToken(user._id);

  res.json({
    accessToken, // 🔥 frontend /me uchun ishlatadi
    refreshToken, // 🔥 keyin yangilash uchun ishlatiladi
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
};

// 2️⃣ Frontendda ikkisini saqlash
// js
// Copy
// Edit
// // login.jsx yoki auth context
// lo
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Email noto‘g‘ri" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Parol noto‘g‘ri" });

//     sendToken(user, res);
//   } catch (err) {
//     res.status(500).json({ message: "Server xatosi", error: err.message });
//   }
// };

// Logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Chiqildi" });
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { model } = require("mongoose");

// const registerUser = async (req, res) => {
//   try {
//     const { fullName, email, password, role } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       {
//         id: newUser?._id,
//         role: newUser?.role,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//       user: {
//         id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });

//     //
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMarch = await bcrypt.compare(password, user?.password);
//     if (!isMarch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//       },
//     });
//     //
//   } catch (error) {}
// };

// module.exports = { registerUser, loginUser };
