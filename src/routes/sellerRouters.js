const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/authMiddleware");
const Seller = require("../models/Seller");

router.post("/add", async (req, res) => {
  try {
    const { email, phone, shopName } = req.body;

    console.log(req.body);

    const errors = {};

    const emailExists = await Seller.findOne({ email });
    if (emailExists) {
      errors.email = "Bu email allaqachon ro'yxatdan o'tgan";
    }

    const phoneExists = await Seller.findOne({ phone });
    if (phoneExists) {
      errors.phone = "Bu telefon raqam allaqachon ro'yxatdan o'tgan";
    }

    const shopExists = await Seller.findOne({ shopName });
    if (shopExists) {
      errors.shopName = "Bu do'kon nomi allaqachon band";
    }

    // Agar kamida bitta xato bo‘lsa
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: "Ro'yxatdan o'tishda xatolik bor",
        errors,
      });
    }

    const seller = await Seller.create({
      ...req.body,
      role: "seller",
    });

    res.status(201).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor!" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id);
    if (!seller) {
      return res.status(404).json({ message: "Seller topilmadi!" });
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik bor!" });
  }
});

module.exports = router;
