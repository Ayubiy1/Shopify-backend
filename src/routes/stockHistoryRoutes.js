const router = require("express").Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");

router.get("/", async (req, res) => {
  try {
    const data = await StockHistory.find()
      .populate("productId")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "Error", e });
  }
});

router.get("/seller", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token yo‘q" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const sellerId = decoded.id; // yoki decoded._id

    const data = await StockHistory.find({ sellerId: decoded.id });

    res.json(data);
  } catch (e) {
    res.status(401).json({
      message: "Token xato yoki muddati tugagan",
      error: e.message,
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products, totalPrice, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Mahsulotlar bo‘sh bo‘lishi mumkin emas" });
    }

    // 1) Har bir product bo‘yicha stockni kamaytirish
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.variants?.length > 0) {
        return res.status(400).json({
          message: "Variantli productlar uchun alohida kod yozish kerak",
        });
      }

      // Stock yetadimi?
      if (product?.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `${product.name} uchun yetarli stock yo‘q` });
      }

      // 2) stock -= quantity
      product?.stock -= item.quantity;

      // 3) numberSold += quantity
      product.numberSold = (product.numberSold || 0) + item.quantity;

      await product.save();

      // 4) StockHistory ga yozish
      await StockHistory.create({
        productId: product._id,
        change: -item.quantity,
        reason: "order",
      });
    }

    // 5) Order yaratamiz
    const order = await Order.create({
      userId: req.user.id,
      products,
      totalPrice,
      paymentMethod,
    });

    res.status(201).json({
      message: "Order muvaffaqiyatli yaratildi",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
