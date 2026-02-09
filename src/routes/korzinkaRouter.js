const express = require("express");
const jwt = require("jsonwebtoken");

const Cart = require("../models/Korzinka").default;
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
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

    const items = await Cart.find({ userId: user._id.toString() });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Productni sotib olish. StockHistory ga qo'shish
router.post("/buy", async (req, res) => {
  try {
    const {
      product,
      variants, // 👈 { color, size }
      quantity,
      totalPrice,
      paymentMethod,
      title,
    } = req.body;

    console.log(req.body);

    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res.status(400).json({ message: "Product topilmadi" });
    }

    // ✅ COMBINATION ORQALI VARIANT TOPISH
    const foundVariant = foundProduct.variants.find(
      (v) =>
        v?.combination?.color === variants?.color &&
        v?.combination?.size === variants?.size,
    );

    if (!foundVariant) {
      return res.status(400).json({ message: "Variant topilmadi" });
    }

    if (foundVariant.stock < quantity) {
      return res
        .status(400)
        .json({ message: "Variantda yetarli mahsulot yo‘q" });
    }

    // ✅ STOCK UPDATE
    foundVariant.stock -= quantity;
    foundVariant.numberSold = (foundVariant.numberSold || 0) + quantity;

    // ✅ HISTORY
    await StockHistory.create({
      productId: foundProduct._id,
      variantId: foundVariant._id || null,
      title,
      changed: -quantity,
      reason: "buy",
      paymentMethod,
      variant: foundVariant.combination,
      totalPrice,
      date: new Date(),
    });

    await foundProduct.save();

    return res.json({
      message: "Xarid muvaffaqiyatli amalga oshirildi!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server xatosi" });
  }
});

{
  // router.post("/buy", async (req, res) => {
  //   try {
  //     const {
  //       product,
  //       variantId,
  //       quantity,
  //       variants,
  //       totalPrice,
  //       paymentMethod,
  //       title,
  //     } = req.body;
  //     const foundProduct = await Product.findById(product);
  //     if (!foundProduct) {
  //       return res.status(400).json({ message: "Product topilmadi" });
  //     }
  //     const variant = foundProduct.variants.find(
  //       (v) => v._id.toString() === product,
  //     );
  //     if (!variant) {
  //       return res.status(400).json({ message: "Variant topilmadi" });
  //     }
  //     if (variant.stock < quantity) {
  //       return res
  //         .status(400)
  //         .json({ message: "Variantda yetarli mahsulot yo‘q" });
  //     }
  //     variant.stock -= quantity;
  //     variant.numberSold = (variant.numberSold || 0) + quantity;
  //     // === STOCK HISTORY YOZISH ===
  //     const history = await StockHistory.create({
  //       productId: foundProduct._id,
  //       variantId: variantId || null,
  //       title,
  //       changed: -quantity,
  //       reason: "buy",
  //       paymentMethod,
  //       variants,
  //       totalPrice,
  //       date: new Date(),
  //     });
  //     await foundProduct.save();
  //     await history.save();
  //     return res.json({
  //       message: "Xarid muvaffaqiyatli amalga oshirildi!",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error: "Server xatosi" });
  //   }
  // });
}

// Karzinkaga qo'shish
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      productId,
      combination,
      count,
      price,
      images,
      variantId,
      title,
      userId,
    } = req.body;

    const existing = await Cart.findOne({
      userId,
      productId,
      "combination.color": combination.color,
      "combination.size": combination.size,
    });

    if (existing) {
      existing.count += count;
      await existing.save();
      return res.json({ message: "Savatcha yangilandi", item: existing });
    }

    const item = await Cart.create({
      productId,
      variantId,
      images,
      combination,
      count,
      price,
      userId,
      title,
    });

    res.json({ message: "Savatchaga qo‘shildi", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Cart.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// 🛒 USER CART
router.get("/:userId", async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId });

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
router.delete("/remove/:id", authMiddleware, async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "O‘chirildi" });
});

module.exports = router;
