const express = require("express");
const jwt = require("jsonwebtoken");

const Cart = require("../models/Korzinka").default;
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const StockHistory = require("../models/StockHistory");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/buy", async (req, res) => {
  console.log(req.body);

  try {
    const {
      product,
      variantId,
      quantity,
      variants,
      totalPrice,
      paymentMethod,
    } = req.body;
    // console.log(req.body);

    const foundProduct = await Product.findById(product);
    // console.log(foundProduct?.variants);
    if (!foundProduct) {
      return res.status(400).json({ message: "Product topilmadi" });
    }

    const variant = foundProduct.variants.find(
      (v) => v._id.toString() === variantId
    );

    console.log(variantId);
    console.log(variant);

    if (!variant) {
      return res.status(400).json({ message: "Variant topilmadi" });
    }

    if (variant.stock < quantity) {
      return res
        .status(400)
        .json({ message: "Variantda yetarli mahsulot yo‘q" });
    }

    variant.stock -= quantity;

    variant.numberSold = (variant.numberSold || 0) + quantity;

    // === STOCK HISTORY YOZISH ===
    const history = await StockHistory.create({
      productId: foundProduct._id,
      variantId: variantId || null,
      changed: -quantity,
      reason: "buy",
      paymentMethod,
      variants,
      totalPrice,
      date: new Date(),
    });

    await foundProduct.save();

    await history.save();

    return res.json({
      message: "Xarid muvaffaqiyatli amalga oshirildi!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server xatosi" });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  const userId = req.user._id;
  const { productId, combination, count, price, images, variantId } = req.body;
  console.log(req.body);

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
  });

  res.json({ message: "Savatchaga qo‘shildi", item });
});
router.get("/:id", async (req, res) => {
  try {
    const order = await Cart.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

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

{
  // router.post("/buy", authMiddleware, async (req, res) => {
  //   try {
  //     const newOrder = new Order({
  //       userId: req.user.id,
  //       products: req.body.products,
  //       totalPrice: req.body.totalPrice,
  //       paymentMethod: req.body.paymentMethod,
  //     });
  //     const savedOrder = await newOrder.save();
  //     // 🔥 STOCK KAMAYTIRISH + HISTORYGA YOZISH
  //     for (const item of req.body.products) {
  //       const product = await Product.findById(item.product);
  //       let oldStock = 0;
  //       let newStock = 0;
  //       let variationName = "";
  //       // Agar variant bo‘lsa → mos variantni topib stockni kamaytirish
  //       if (product.variants?.length > 0) {
  //         const variantIndex = product.variants.findIndex(
  //           (v) => v._id.toString() === item.variantId
  //         );
  //         if (variantIndex !== -1) {
  //           oldStock = product.variants[variantIndex].stock;
  //           product.variants[variantIndex].stock -= item.quantity;
  //           newStock = product.variants[variantIndex].stock;
  //           variationName = `${product.variants[variantIndex].combination.color} - ${product.variants[variantIndex].combination.size}`;
  //         }
  //       } else {
  //         // Agar variant bo‘lmasa → default variant stockini kamaytiramiz
  //         if (product.variants?.length) {
  //           oldStock = product.variants[0].stock;
  //           product.variants[0].stock -= item.quantity;
  //           newStock = product.variants[0].stock;
  //           variationName = "Default";
  //         }
  //       }
  //       await product.save();
  //       // 🔥 StockHistory ga yozish
  //       await StockHistory.create({
  //         productId: product._id,
  //         variation: variationName,
  //         oldStock: oldStock,
  //         newStock: newStock,
  //         change: -item.quantity,
  //         reason: "buy",
  //         userId: req.user.id,
  //       });
  //     }
  //     res.status(201).json(savedOrder);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });
  // {
  //   router.post("/buy", authMiddleware, async (req, res) => {
  //     try {
  //       const newOrder = new Order({
  //         userId: req.user.id,
  //         products: req.body.products,
  //         totalPrice: req.body.totalPrice,
  //         paymentMethod: req.body.paymentMethod,
  //       });
  //       const savedOrder = await newOrder.save();
  //       // 🔥 STOCK KAMAYTIRISH VA HISTORY YOZISH
  //       for (const item of req.body.products) {
  //         const product = await Product.findById(item.product);
  //         if (!product) continue;
  //         // Agar variantli product bo'lsa
  //         if (product.variants && product.variants.length > 0) {
  //           const variantIndex = product.variants.findIndex(
  //             (v) => v._id.toString() === item.variantId
  //           );
  //           if (variantIndex !== -1) {
  //             // 🔥 STOCK -= quantity
  //             product.variants[variantIndex].stock -= item.quantity;
  //             // 🔥 numberSold += quantity
  //             product.variants[variantIndex].numberSold =
  //               (product.variants[variantIndex].numberSold || 0) + item.quantity;
  //             await product.save();
  //             // 🔥 STOCK HISTORYGA YOZAMIZ
  //             await StockHistory.create({
  //               productId: product._id,
  //               change: -item.quantity,
  //               reason: "order",
  //             });
  //           }
  //         } else {
  //           // Variant yo‘q bo'lsa oddiy stockni kamaytirish
  //           if (product.variants?.length) {
  //             product.variants[0].stock -= item.quantity;
  //             // product.variants[0].stock -= item.quantity;
  //           }
  //           product.numberSold = (product.numberSold || 0) + item.quantity;
  //           await product.save();
  //           // 🔥 STOCK HISTORYGA YOZAMIZ
  //           await StockHistory.create({
  //             productId: product._id,
  //             change: -item.quantity,
  //             reason: "order",
  //           });
  //         }
  //       }
  //       res.status(201).json(savedOrder);
  //     } catch (error) {
  //       console.log(error);
  //       res.status(500).json({ message: "Server error", error });
  //     }
  //   });
  // }
  // 🛒 CARTGA QO‘SHISH
}
{
  //   if (!foundProduct) {
  //   return res.status(400).json({ message: "Product topilmadi" });
  // }
  // let variantIndex = -1;
  // if (variantId) {
  //   variantIndex = foundProduct.variants.findIndex(
  //     (v) => v._id.toString() === variantId
  //   );
  //   if (variantIndex === -1) {
  //     return res.status(400).json({ message: "Variant topilmadi!!!" });
  //   }
  //   if (foundProduct.variants[variantIndex].stock < quantity) {
  //     return res
  //       .status(400)
  //       .json({ message: "Variantda yetarli mahsulot yo‘q" });
  //   }
  //   foundProduct.variants[variantIndex].stock -= quantity;
  // } else {
  //   if (foundProduct.stock < quantity) {
  //     return res.status(400).json({ message: "Mahsulot yetarli emas" });
  //   }
  //   foundProduct.stock -= quantity;
  // }
}
