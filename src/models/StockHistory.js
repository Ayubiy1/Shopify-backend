const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    changed: Number,
    reason: String,
    paymentMethod: String,
    variants: Object,
    totalPrice: Number,
    date: Date,
  },
  { timestamps: true }
);

// const StockHistorySchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: () => new mongoose.Types.ObjectId(),
//     ref: "Product",
//     required: true,
//   },
//   variant: {
//     color: String,
//     size: String,
//   },
//   change: Number, // +5, -2
//   reason: String, // "order", "manual", "return"
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

module.exports = mongoose.model("StockHistory", stockHistorySchema);
