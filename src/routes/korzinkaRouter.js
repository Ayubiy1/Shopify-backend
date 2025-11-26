const express = require("express");
const Cart = require("../models/Korzinka").default;
const { authMiddleware } = require("../middleware/authMiddleware");
const Product = require("../models/Product");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  // console.log(req);

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

    // console.log("req.body", req.body);

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

{
  // router.post("/add", authMiddleware, async (req, res) => {
  //   try {
  //     const { productId, combination, quantity } = req.body;
  //     const product = await Product.findById(productId);
  //     if (!product) return res.status(404).json({ error: "Product topilmadi" });
  //     // ✔ Tanlangan variantni topamiz
  //     const variant = product?.variants?.find(
  //       (v) =>
  //         v?.combination?.color === combination?.color &&
  //         v?.combination?.size === combination?.size
  //     );
  //     // const variant = product.variants.find(
  //     //   (v) => v.color == combination.color && v.size == combination.size
  //     // );
  //     if (!variant) return res.status(400).json({ error: "Variant topilmadi" });
  //     // ❗ Tovar yetadimi?
  //     if (variant.stock < quantity)
  //       return res.status(400).json({ error: "Yetarli stock yo‘q" });
  //     // ✔ Stockni kamaytirish
  //     variant.stock -= quantity;
  //     await product.save();
  //     // ✔ Savatchaga qo‘shish
  //     const newItem = new Cart({
  //       userId: req.user._id,
  //       productId,
  //       title: product.title,
  //       combination,
  //       images: variant.images,
  //       price: variant.price,
  //       count: quantity,
  //     });
  //     await newItem.save();
  //     res.json({
  //       message: "Savatchaga qo‘shildi, stock kamaytirildi",
  //       item: newItem,
  //     });
  //   } catch (error) {
  //     console.error("Cart Add Error:", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // });
}
{
  // router.post("/add", authMiddleware, async (req, res) => {
  //   try {
  //     const { productId, title, combination, images, price, count } = req.body;
  //     const userId = req.user._id;
  //     if (!productId || !combination)
  //       return res
  //         .status(400)
  //         .json({ error: "Majburiy maydonlar to‘ldirilmagan" });
  //     // 1) CARTDA BOR YOKI YO'QLIGINI TEKSHIRISH
  //     let existItem = await Cart.findOne({
  //       userId,
  //       productId,
  //       "combination.color": combination.color,
  //       "combination.size": combination.size,
  //     });
  //     // 2) PRODUCTNI O'ZINI TOPAMIZ
  //     const product = await Product.findById(productId);
  //     if (!product) return res.status(404).json({ error: "Product topilmadi" });
  //     const variant = product.variants.find(
  //       (v) =>
  //         v.combination.color === combination.color &&
  //         v.combination.size === combination.size
  //     );
  //     if (!variant) return res.status(404).json({ error: "Variant topilmadi" });
  //     // ❗ Omborda yetarli bo'lishini tekshirish
  //     if (variant.stock < count)
  //       return res.status(400).json({ error: "Omborda yetarli mahsulot yo‘q" });
  //     // 3) AGAR CARTDA BOR BO'LSA → COUNTNI OSHIRAMIZ
  //     if (existItem) {
  //       existItem.count += count;
  //       await existItem.save();
  //     } else {
  //       existItem = await Cart.create({
  //         userId,
  //         productId,
  //         title,
  //         combination,
  //         images,
  //         price,
  //         count,
  //       });
  //     }
  //     // 4) PRODUCT VARIANT STOCKINI KAMAYTIRISH
  //     variant.stock -= count;
  //     await product.save();
  //     res.json({
  //       message: "Savatchaga qo‘shildi!",
  //       item: existItem,
  //       remainingStock: variant.stock,
  //     });
  //   } catch (error) {
  //     console.log("Cart Add Error:", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // });
}
{
  // router.post("/add", authMiddleware, async (req, res) => {
  //   try {
  //     // console.log("Cart Add:", req.body);
  //     const { productId, title, combination, images, price } = req.body;
  //     const checlProduct = await Cart.findOne({
  //       userId,
  //       productId,
  //       "combination.color": combination.color,
  //       "combination.size": combination.size,
  //     });
  //     console.log(checlProduct);
  //     if (!productId || !combination) {
  //       return res
  //         .status(400)
  //         .json({ error: "Majburiy maydonlar to‘ldirilmagan" });
  //     }
  //     if (checlProduct) {
  //       // Agar bo‘lsa → count ni bittaga oshiramiz
  //       checlProduct.count += 1;
  //       await checlProduct.save();
  //       return res.json({ message: "Count yangilandi", item: checlProduct });
  //     }
  //     const newItem = new Cart({
  //       userId: req.user._id, // JWT dan kelgan userID
  //       productId,
  //       title,
  //       combination,
  //       images,
  //       price,
  //       quantity: 1,
  //     });
  //     // await newItem.save();
  //     // res.json({ message: "Savatchaga qo‘shildi!", item: newItem });
  //   } catch (error) {
  //     console.error("Cart Add Error:", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // });
}
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

{
  // const express = require("express");
  // const Cart = require("../models/Korzinka").default;
  // const { authMiddleware } = require("../middleware/authMiddleware");
  // const router = express.Router();
  // // 🛒 CARTGA QO‘SHISH
  // router.post("/add", authMiddleware, async (req, res) => {
  //   try {
  //     console.log("Cart Add:", req.body);
  //     const { productId, title, combination, images, price } = req.body;
  //     if (!productId || !combination) {
  //       return res
  //         .status(400)
  //         .json({ error: "Majburiy maydonlar to‘ldirilmagan" });
  //     }
  //     const newItem = new Cart({
  //       userId: req.user.userId, // JWT dan avtomatik chiqaryapmiz
  //       productId,
  //       title,
  //       combination,
  //       images,
  //       price,
  //       quantity: 1,
  //     });
  //     await newItem.save();
  //     res.json({ message: "Savatchaga qo‘shildi!", item: newItem });
  //   } catch (error) {
  //     console.error("Cart Add Error:", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // });
  // // router.post("/add", async (req, res) => {
  // //   try {
  // //     console.log("Cart add request:", req.body);
  // //     const { userId, productId, title, combination, images, price } = req.body;
  // //     if (!userId || !productId || !combination) {
  // //       return res
  // //         .status(400)
  // //         .json({ error: "Majburiy maydonlar to‘ldirilmagan" });
  // //     }
  // //     const newItem = new Cart({
  // //       userId,
  // //       productId,
  // //       title,
  // //       combination,
  // //       images,
  // //       price,
  // //       quantity: 1,
  // //       createdAt: new Date(),
  // //     });
  // //     await newItem.save();
  // //     res.json({ message: "Savatchaga qo‘shildi!", item: newItem });
  // //   } catch (error) {
  // //     console.log("Cart Add Error:", error);
  // //     res.status(500).json({ error: error.message });
  // //   }
  // // });
  // // router.post("/add", async (req, res) => {
  // //   try {
  // //     console.log(req?.body);
  // //     const { userId, productId, title, combination } = req.body;
  // //     const newItem = new Cart({
  // //       userId,
  // //       productId,
  // //       title,
  // //       combination,
  // //     });
  // //     await newItem.save();
  // //     res.json({ message: "Savatchaga qo‘shildi!", item: newItem });
  // //   } catch (error) {
  // //     res.status(500).json({ error: error.message });
  // //   }
  // // });
  // // 🛒 USER CART LIST
  // router.get("/:userId", async (req, res) => {
  //   try {
  //     const items = await Cart.find({ userId: req.params.userId });
  //     res.json(items);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });
  // // 🗑 CARTDAN O‘CHIRISH
  // router.delete("/:id", async (req, res) => {
  //   try {
  //     await Cart.findByIdAndDelete(req.params.id);
  //     res.json({ message: "O‘chirildi!" });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });
  // module.exports = router;
  // const express = require("express");
  // import Cart from "../models/Korzinka";
  // const router = express.Router();
  // // Productni karzinkaga qoshish
  // router.post("/add", async (req, res) => {
  //   try {
  //     console.log(req.body);
  //     const { userId, productId, title, combination } = req.body;
  //     const newItem = new Cart({
  //       userId,
  //       productId,
  //       title,
  //       combination,
  //     });
  //     await newItem.save(
  //       res.json({ message: "Savatchaga qo‘shildi!", item: newItem })
  //     );
  //   } catch (error) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });
  // // productni UserId orqali olish
  // router.get("/:userId", async (req, res) => {
  //   try {
  //     const items = await Cart.find({ userId: req.params.userId });
  //     res.json(items);
  //   } catch (error) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });
  // // productni karzinkadan remove qilish
  // router.delete("/:id", async (req, res) => {
  //   try {
  //     const { id } = req.body;
  //     await Cart.findByIdAndDelete(id);
  //     res.json({ message: "O‘chirildi!" });
  //   } catch (error) {
  //     res.status(500).json({ error: err.message });
  //   }
  // });
  // export default router;
}
