const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const {
  authMiddleware,
  sellerMiddleware,
} = require("../middleware/authMiddleware");

// CREATE product (Seller yoki Admin)
router.post("/", authMiddleware, sellerMiddleware, async (req, res) => {
  // console.log(req.body);

  try {
    const product = new Product({
      ...req.body,
      owner: req.user._id, // Sellerga bog‘lash
    });

    console.log(product);

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET all products (Hamma ko‘ra oladi)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate(
      "owner",
      "fullName email role"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product topilmadi" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// UPDATE product
router.put("/:id", authMiddleware, sellerMiddleware, async (req, res) => {
  console.log(req.params.id);

  try {
    const product = await Product.findById(req.params.id);
    console.log("product", product);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Agar seller bo‘lsa faqat o‘zini productini yangilay oladi
    if (
      req.user.role === "seller" &&
      product.owner.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// DELETE product
router.delete("/:id", authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (
      req.user.role === "seller" &&
      product.owner.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// filter
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    let filter = {};

    // search bo‘yicha qidirish (name va title dan)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    // category bo‘yicha filter
    if (category) {
      filter.category = category;
    }

    // narx oralig‘i bo‘yicha filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).populate("category");

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// search product
router.get("/search", async (res, req) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "")
      return res.status(400).json({ message: "Search query is required" });

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

{
  // const express = require("express");
  // const User = require("../models/User"); // User modelini import qiling
  // const Product = require("../models/Product");
  // const router = express.Router();
  // // Product qo'shish
  // router.post("/", async (req, res) => {
  //   try {
  //     const newProduct = new Product({
  //       ...req.body,
  //       owner: req.user._id,
  //     });
  //     await newProduct.save();
  //     res.status(201).json(newProduct);
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });
  // // Product larni olish
  // router.get("/", async (req, res) => {
  //   try {
  //     const products = await Product.find();
  //     res.json(products);
  //     //
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });
  // // ID orqali product ni olish
  // router.get("/:id", async (req, res) => {
  //   try {
  //     const product = await Product.findById(req.params.id);
  //     if (!product) res.status(404).json({ message: "Product not found" });
  //     res.json(product);
  //     //
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });
  // // Productni ochirish
  // router.delete("/:id", async (req, res) => {
  //   try {
  //     const product = await Product.findOneAndDelete(req.params.id);
  //     if (!product) return res.status(404).json({ message: "Product not found" });
  //     res.json({ message: "Product deleted successfully" });
  //     //
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });
}
