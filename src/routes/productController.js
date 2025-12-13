const Product = require("../models/Product");

exports.getBestSellers = async (req, res) => {
  try {
    const data = await Product.find().sort({ numberSold: -1 }).limit(20);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};
