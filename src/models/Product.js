const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    options: [
      {
        name: String, // masalan: color, size
        values: [String], // ["oq", "qora", "ko'k"]
      },
    ],

    variants: [
      {
        combination: {
          type: Object, // { color: "oq", size: "40" }
          required: true,
        },
        price: Number,
        stock: Number,
        image: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

{
  // const mongoose = require("mongoose");
  // const productSchema = new mongoose.Schema(
  //   {
  //     name: {
  //       type: String,
  //       required: true,
  //     },
  //     description: String,
  //     price: {
  //       type: Number,
  //       required: true,
  //     },
  //     image: String,
  //     category: String,
  //     categoryId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Category",
  //       required: true,
  //     },
  //     inStock: { type: Boolean, default: true },
  //     images: [
  //       {
  //         type: String, // product rasmlari
  //       },
  //     ],
  //     isActive: {
  //       type: Boolean,
  //       default: true,
  //     },
  //     colors: [
  //       {
  //         colorName: String, // Masalan: “Gold”, "Black", "Blue"
  //         images: [String], // Shu rangga tegishli rasmlar
  //         stock: Number, // Shu rang bo‘yicha qoldiq
  //       },
  //     ],
  //     owner: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //     }, // Seller kimligini saqlash
  //   },
  //   { timestamps: true }
  // );
  // module.exports = mongoose.model("Product", productSchema);
}

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
