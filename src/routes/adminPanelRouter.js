const express = require("express");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Korzinka").default;
const User = require("../models/User");
const Product = require("../models/Product");

const router = express.Router();

router.get("/get", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token yo'q!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User topilmadi!" });
    }

    // Check admin permission
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Sizda ruxsat yo'q!" });
    }

    // Get data
    const carts = await Cart.find();
    const users = await User.find();
    const products = await Product.find();

    // Orders
    const orders = carts.length;

    // Today Income
    const today = new Date().toISOString().slice(0, 10);

    const todayIncome = carts
      .filter((item) => item.createdAt?.toISOString().slice(0, 10) === today)
      .reduce((sum, item) => sum + item.price * item.count, 0);

    // Return stats object
    res.json({
      users: users.length,
      products: products.length,
      orders,
      todayIncome,
      data: products,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Serverda xatolik bor!" });
  }
});
router.get("/stats", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token yo'q!" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (user.role !== "admin")
      return res.status(403).json({ message: "Ruxsat yo'q!" });

    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Cart.countDocuments();

    const productss = await Product.find();

    let totalStock = 0;

    productss.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          totalStock += variant.stock; // har bir variantning stockini qo‘shamiz
        });
      }
    });

    // =============== 🟦 1 HAFTALIK INCOME ===================
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const weeklyOrders = await Cart.find({
      $or: [
        { createdAt: { $gte: sevenDaysAgo } },
        { createdAt: { $exists: false } }, // timestamps yo‘qlarni ham olish
      ],
    });

    let weeklyIncome = 0;
    weeklyOrders.forEach((item) => {
      weeklyIncome += item.price * item.count;
    });

    return res.json({
      users,
      products: totalStock,
      orders,
      weeklyIncome,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server xatolik!" });
  }
});
router.get("/orders", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token yo'q!" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (user.role !== "admin")
      return res.status(403).json({ message: "Ruxsat yo'q!" });

    const carts = await Cart.find();

    // Productlarni birlashtirish
    const productMap = {};

    carts.forEach((item) => {
      const name = item.title; // yoki item.name, sizning schema ga qarab
      if (!productMap[name]) {
        productMap[name] = { ...item._doc }; // birinchi uchrashuv, count allaqachon bor
      } else {
        productMap[name].count += item.count;
        productMap[name].price += item.price;
      }
    });

    const mergedProducts = Object.values(productMap);

    res.json(mergedProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Serverda xatolik bor!" });
  }
});
router.get("/chart", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token yo'q!" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Ruxsat yo'q!" });
    }

    const carts = await Cart.find();

    // Agar createdAt bo‘lmasa ham frontend ishlashi uchun
    const chartData = carts.map((item) => ({
      _id: item._id.toString(), // frontend parse qiladi
      price: item.price,
      count: item.count,
    }));

    res.json(chartData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Serverda xatolik bor!" });
  }
});

module.exports = router;
