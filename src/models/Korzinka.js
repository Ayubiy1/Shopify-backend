import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    count: Number,
    productId: String,
    variantId: String,
    title: String,
    images: [String], // variantning 1 yoki ko‘p rasmi
    price: Number,
    combination: {
      color: String,
      size: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
