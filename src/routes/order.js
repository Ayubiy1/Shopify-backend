const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyAdmin,
  verifyUser,
} = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const Cart = require("../models/Korzinka");
const StockHistory = require("../models/StockHistory");

// ✅ Yangi order qo‘shish (faqat login bo‘lgan user)
router.post("/buy", verifyToken, async (req, res) => {
  try {
    const { products, totalPrice, shippingAddress, paymentMethod } = req.body;

    // 1) Har bir productni yangilash uchun model chaqiramiz

    // 2) Productlar bo‘yicha yuramiz
    for (let item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Mahsulot topilmadi" });
      }

      // Variantni topamiz
      const variant = product.variants.find(
        (v) =>
          v.combination.color === item.combination.color &&
          v.combination.size === item.combination.size
      );

      if (!variant) {
        return res.status(404).json({ message: "Variant topilmadi orderJs" });
      }

      // Stock yetarlimi?
      if (variant.stock < item.count) {
        return res.status(400).json({
          message: `Yetarli stock yo‘q: ${variant.combination.color} / ${variant.combination.size}`,
        });
      }

      // 3) Stockni kamaytirish
      variant.stock -= item.count;

      // 4) Productni saqlash
      await product.save();

      // 5) StockHistory qo‘shish
      await StockHistory.create({
        productId: product._id,
        variant: {
          color: variant.combination.color,
          size: variant.combination.size,
        },
        change: -item.count,
        reason: "order",
      });
    }

    // 6) Orderni yaratish
    const newOrder = new Order({
      userId: req.user.id,
      products,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order Create Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Foydalanuvchining faqat o‘z buyurtmalarini olish
router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate(
      "products.product"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Hamma orderlarni olish (faqat admin)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ id: req.params?._id })
      .populate("userId", "fullName email") // user ma'lumotlari
      .populate("products.product", "name price"); // product ma'lumotlari

    // console.log(orders);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Bitta orderni olish (faqat owner yoki admin)
router.get("/:id", verifyUser, async (req, res) => {
  try {
    const order = await Cart.find({ userId: req.user._id });
    // console.log(order);

    // const items = await Cart.find({ userId: req.user._id });

    // .populate("userId", "fullName email")
    // .populate("products.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // faqat owner yoki admin ko‘ra oladi
    if (
      order.userId._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Order statusini yangilash (faqat admin)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Orderni o‘chirish (faqat admin)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
