const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require("../models/User");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// TOKEN GENERATORS
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30m",
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
    const { fullName, email, password, role, additionId } = req.body;

    const lowerEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email: lowerEmail,
      password: hashedPassword,
      role: role ?? "buyer",
      ...(role === "seller" && { additionId }),
    });

    await newUser.save();

    res.status(201).json({
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        additionId: newUser.additionId || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register error" });
  }
});

{
  // router.post("/register", async (req, res) => {
  //   try {
  //     const { fullName, email, password, role, additionId } = req.body;
  //     const existingUser = await User.findOne({ email: email.toLowerCase() });
  //     if (existingUser)
  //       return res.status(400).json({ message: "User already exists" });
  //     const hashed = await bcrypt.hash(password, 10);
  //     if (role !== "seller") {
  //       const newUser = new User({
  //         fullName,
  //         email: email.toLowerCase(),
  //         password: hashed,
  //         role: role || "buyer" || "seller",
  //       });
  //       await newUser.save();
  //       return res.status(201).json({
  //         user: {
  //           id: newUser._id,
  //           fullName: newUser.fullName,
  //           email: newUser.email,
  //           role: newUser.role,
  //         },
  //       });
  //     } else {
  //       const newUserSeller = new User({
  //         fullName,
  //         email: email.toLowerCase(),
  //         password: hashed,
  //         additionId: additionId,
  //         role: role || "buyer" || "seller",
  //       });
  //       await newUserSeller.save();
  //       return res.status(201).json({
  //         user: {
  //           id: newUserSeller._id,
  //           fullName: newUserSeller.fullName,
  //           email: newUserSeller.email,
  //           role: newUserSeller.role,
  //           additionId: newUserSeller.additionId,
  //         },
  //       });
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
}

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
});

{
  // router.post("/login", async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const user = await User.findOne({ email });
  //     if (!user) return res.status(400).json({ message: "User not found" });
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(400).json({ message: "Wrong password" });
  //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //       expiresIn: "7d",
  //     });
  //     // 🔴 COOKIE YO‘Q
  //     res.json({
  //       token,
  //       user: {
  //         id: user._id,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(500).json({ message: "Login error" });
  //   }
  // });
}

{
  // router.post("/login", async (req, res) => {
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
  //     // 🍪 COOKIE
  //     res.cookie("token", accessToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "none",
  //       maxAge: 60 * 60 * 1000,
  //     });
  //     return res.json({
  //       accessToken, // 🔥 TOKEN FRONTENDGA KETADI!
  //       refreshToken,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         role: user.role,
  //         additionId: user.additionId,
  //       },
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
}

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    // Yangi user yaratamiz
    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        googleId,
      });
    }

    // TOKENLAR GENERATSIYASI
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // COOKIEga ACCESS TOKEN YOZILADI
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

{
  // router.post("/google", async (req, res) => {
  //   const { token } = req.body;
  //   try {
  //     console.log("Token:", token);
  //     console.log("Backend Client ID:", process.env.GOOGLE_CLIENT_ID);
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID, // frontend Client ID bilan bir xil
  //     });
  //     const payload = ticket.getPayload();
  //     const { email, name, sub: googleId } = payload;
  //     let user = await User.findOne({ email });
  //     if (!user) {
  //       user = await User.create({
  //         fullName: name,
  //         email,
  //         googleId,
  //         password: null,
  //       });
  //     }
  //     const accessToken = generateAccessToken(user);
  //     const refreshToken = generateRefreshToken(user);
  //     user.refreshToken = refreshToken;
  //     await user.save();
  //     res.cookie(token, accessToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: true,
  //       maxAge: 60 * 60 * 1000,
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
  //     console.error(err);
  //     res.status(401).json({ message: "Invalid token" });
  //   }
  // });
}
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
