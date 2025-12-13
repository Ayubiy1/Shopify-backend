const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      // VARIANT mavjud bo‘lsa
      if (item.combination) {
        const variant = product.variants.find(
          (v) =>
            v.combination.color === item.combination.color &&
            v.combination.size === item.combination.size
        );

        if (variant) {
          variant.stock -= item.quantity;
          variant.numberSold += item.quantity;
        }
      }

      // PRODUCT umumiy sotilgan sonini oshirish
      product.numberSold += item.quantity;

      await product.save();

      // Stock History qo‘shish
      await StockHistory.create({
        productId: product._id,
        variant: item.combination
          ? {
              color: item.combination.color,
              size: item.combination.size,
            }
          : null,
        change: -item.quantity,
        reason: "order",
      });
    }

    res.json({ message: "Order created!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", error });
  }
};
