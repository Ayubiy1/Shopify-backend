const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    image: String,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    inStock: { type: Boolean, default: true },
    images: [
      {
        type: String, // product rasmlari
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    colors: [
      {
        colorName: String, // Masalan: “Gold”, "Black", "Blue"
        images: [String], // Shu rangga tegishli rasmlar
        stock: Number, // Shu rang bo‘yicha qoldiq
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // Seller kimligini saqlash
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

// // models/Product.js
// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     stock: {
//       type: Number,
//       default: 0,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     images: [
//       {
//         type: String, // product rasmlari
//       },
//     ],
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);
