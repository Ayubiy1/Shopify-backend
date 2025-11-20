const express = require("express");
const Cart = require("../models/Korzinka");

const router = express.Router();

// 🛒 CARTGA QO‘SHISH
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, title, combination } = req.body;

    const newItem = new Cart({
      userId,
      productId,
      title,
      combination,
    });

    await newItem.save();
    res.json({ message: "Savatchaga qo‘shildi!", item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🛒 USER CART LIST
router.get("/:userId", async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId });
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
