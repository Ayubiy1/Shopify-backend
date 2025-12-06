const express = require("express");
const jwt = require("jsonwebtoken");

const Cart = require("../models/Korzinka").default;
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛒 CARTGA QO‘SHISH
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // 🔥 JWT dan keladi
    const { productId, title, combination, images, price, count } = req.body;

    if (!productId || !combination) {
      return res
        .status(400)
        .json({ error: "Majburiy maydonlar to‘ldirilmagan" });
    }

    // 🔍 Product mavjudligini tekshirish
    const existingItem = await Cart.findOne({
      userId,
      productId,
      "combination.color": combination.color,
      "combination.size": combination.size,
    });

    // Agar bor bo‘lsa → count++
    if (existingItem) {
      existingItem.count = existingItem.count + count;
      await existingItem.save();

      console.log(existingItem);

      return res.json({
        message: "Count yangilandi",
        item: existingItem,
      });
    }

    // Agar yo‘q bo‘lsa → yangi item yaratamiz
    const newItem = new Cart({
      userId,
      productId,
      title,
      images,
      price,
      combination,
      count,
    });

    // 🔥 Schema bo‘yicha

    await newItem.save();

    console.log("newItem", newItem);

    res.json({
      message: "Savatchaga qo‘shildi!",
      item: newItem,
    });
  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🛒 USER CART
router.get("/:userId", async (req, res) => {
  console.log(req.params);

  try {
    const items = await Cart.find({ userId: req.params.userId });
    console.log(items);

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL FOR ADMIN AND ADMIN ASSIST
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) res.status(404).json({ message: "User topilmadi!" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = User.findById(decoded);

    if (!user) res.status(404).json({ message: "User topilmadi!" });

    if (!user.role === "admin") res.status(404).json({ message: "ruhat yo'q" });

    const items = await Cart.find();

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🗑 CARTDAN O‘CHIRISH
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "O‘chirildi!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
