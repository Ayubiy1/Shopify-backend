const express = require("express");
const User = require("../models/User"); // User modelini import qiling
const router = express.Router();

// Barcha userlarni olish (faqat admin uchun bo'lishi mumkin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // parolni chiqarib tashlaymiz
    console.log(users);

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
  console.log(req.body);

  try {
    const { fullName, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json(updatedUser);

    //
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

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
