import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  productId: String,
  combination: {
    color: String,
    memory: String,
    images: [
      {
        type: String, // product rasmlari
      },
    ],
    stock: Number,
  },
});

export default mongoose.model("Cart", cartSchema);

// const express = require("express");
// const mongoose = require("mongoose");

// const KorzinkaSchema = new mongoose.Schema({
//   title: String,
//   productId: String,
//   combination: {
//     color: String,
//     memory: String,
//     images: [
//       {
//         type: String, // product rasmlari
//       },
//     ],
//     stock: Number,
//   },
// });

// module.exports = mongoose.model("Carousel", KorzinkaSchema);
