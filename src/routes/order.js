const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyAdmin,
  verifyUser,
} = require("../middleware/authMiddleware");

// ✅ Yangi order qo‘shish (faqat login bo‘lgan user)
router.post("/", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order({
      userId: req.user.id, // token ichidan olinadi
      products: req.body.products,
      totalPrice: req.body.totalPrice,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
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
    const orders = await Order.find()
      .populate("userId", "fullName email") // user ma'lumotlari
      .populate("products.product", "name price"); // product ma'lumotlari
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Bitta orderni olish (faqat owner yoki admin)
router.get("/:id", verifyUser, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "fullName email")
      .populate("products.product", "name price");

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
