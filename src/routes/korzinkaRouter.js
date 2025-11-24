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
    const { productId, title, combination, images, price } = req.body;

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
      existingItem.count = (existingItem.count || 1) + 1;
      await existingItem.save();

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
      count: 1, // 🔥 Schema bo‘yicha
    });

    await newItem.save();

    res.json({
      message: "Savatchaga qo‘shildi!",
      item: newItem,
    });
  } catch (error) {
    console.error("Cart Add Error:", error);
    res.status(500).json({ error: error.message });
  }
});

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
