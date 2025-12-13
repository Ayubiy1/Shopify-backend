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
        name: String, // color, size
        values: [String],
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
        numberSold: { type: Number, default: 0 }, // 🔥 VARIANT sotilgan soni
        image: String,
      },
    ],
    numberSold: {
      type: Number,
      default: 0, // 🔥 Product umumiy sotilgan soni
    },
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

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//     },

//     price: {
//       type: Number,
//       required: true,
//     },

//     category: {
//       type: String,
//       required: true,
//     },

//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     images: [
//       {
//         type: String,
//       },
//     ],

//     options: [
//       {
//         name: String, // masalan: color, size
//         values: [String], // ["oq", "qora", "ko'k"]
//       },
//     ],

//     variants: [
//       {
//         combination: {
//           type: Object, // { color: "oq", size: "40" }
//           required: true,
//         },
//         price: Number,
//         stock: Number,
//         image: String,
//       },
//     ],

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     inStock: {
//       type: Boolean,
//       default: true,
//     },

//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);
