const express = require("express");
// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require("bcryptjs");

const User = require("../models/User"); // User modelini import qiling
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user); // 🔥 token orqali topilgan user
});

// Barcha userlarni olish (faqat admin uchun bo'lishi mumkin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // parolni chiqarib tashlaymiz

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔹 Userni ID si orqalik Get qilib olish
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
    //
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Userni malumotlarini yagilash / update Put
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID required" });
    }

    const updateData = { ...req.body };

    if (updateData.password?.trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("❌ UPDATE USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// router.put("/:id", async (req, res) => {
//   console.log(req.body);
//   console.log(req.params.id);

//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });

//     if (!updatedUser)
//       return res.status(404).json({ message: "User not found" });

//     res.json(updatedUser);

//     //
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Userni o'chirish
router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
    //
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

{
  // router.post("/auth/google", async (req, res) => {
  //   const { token } = req.body;
  //   try {
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //     });
  //     const payload = ticket.getPayload();
  //     const { email, name, sub: googleId } = payload;
  //     // Foydalanuvchini tekshirish yoki yaratish
  //     let user = await User.findOne({ email });
  //     if (!user) {
  //       user = await User.create({ name, email, googleId });
  //     }
  //     res.json(user);
  //   } catch (err) {
  //     res.status(401).json({ message: "Invalid token" });
  //   }
  // });
}
