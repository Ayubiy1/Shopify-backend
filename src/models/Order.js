// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // keyinchalik User schema qo‘shamiz
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    // shippingAddress: {
    //   fullName: String,
    //   phone: String,
    //   city: String,
    //   address: String,
    //   postalCode: String,
    // },
    paymentMethod: {
      type: String,
      enum: ["naqt", "karta"],
      default: "karta",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
