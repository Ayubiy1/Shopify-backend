const express = require("express");
const Category = require("../models/Category");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
// const {
//   authMiddleware,
//   adminMiddleware,
// } = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Yangi category qo‘shish (admin)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔹 Hamma categorylarni olish
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Bitta categoryni olish
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category topilmadi" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Categoryni yangilash (admin)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category)
      return res.status(404).json({ message: "Category topilmadi" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Categoryni o‘chirish (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category topilmadi" });
    res.json({ message: "Category o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
