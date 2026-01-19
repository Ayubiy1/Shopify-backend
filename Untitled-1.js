{
  // router.put("/:id", sellerMiddleware, async (req, res) => {
  //   console.log(req?.body?.owner);
  //   try {
  //     const product = await Product.findById(req.params.id);
  //     if (!product) return res.status(404).json({ message: "Product not found" });
  //     // Agar seller bo‘lsa faqat o‘zini productini yangilay oladi
  //     if (
  //       req.user.role === "buyer" &&
  //       product.owner.toString() !== req?.body?.owner.toString()
  //     ) {
  //       return res
  //         .status(403)
  //         .json({ message: "Not authorized to update this product" });
  //     }
  //     Object.assign(product, req.body);
  //     await product.save();
  //     res.json(product);
  //   } catch (error) {
  //     res.status(500).json({ message: "Server error", error });
  //   }
  // });
}

{
  // const express = require("express");
  // const mongoose = require("mongoose");
  // const cors = require("cors");
  // const cookieParser = require("cookie-parser");
  // require("dotenv").config();
  // const authRoutes = require("./routes/auth");
  // const userRoutes = require("./routes/userRoutes");
  // const categoryRoutes = require("./routes/categoryRoutes");
  // const productRoutes = require("./routes/productRoutes");
  // const coruselRoutes = require("./routes/corusel");
  // const korzinkaRouter = require("./routes/korzinkaRouter");
  // const adminPanelRouter = require("./routes/adminPanelRouter");
  // const User = require("./models/User");
  // const app = express();
  // // Middlewares
  // app.use(cookieParser());
  // app.use(express.json({ limit: "10mb" }));
  // app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  // // CORS setup
  // app.use(
  //   cors({
  //     origin: ["https://shopify-steel-two.vercel.app", "http://localhost:5173"],
  //     credentials: true,
  //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  //     allowedHeaders: ["Content-Type", "Authorization"],
  //   })
  // );
  // // Routes
  // app.use("/api/cart", korzinkaRouter);
  // app.use("/api/admin", adminPanelRouter);
  // app.use("/api/auth", authRoutes);
  // app.use("/api/users", userRoutes);
  // app.use("/api/categories", categoryRoutes);
  // app.use("/api/products", productRoutes);
  // app.use("/api/corusel", coruselRoutes);
  // // app.use("/api/orders", require("./routes/orderRoutes"));
  // app.use("/api/stock-history", require("./routes/stockHistoryRoutes"));
  // // MongoDB connect
  // mongoose
  //   .connect(process.env.MONGO_URI)
  //   .then(() => {
  //     console.log("✅ MongoDB connected");
  //     app.listen(process.env.PORT || 3000, () =>
  //       console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
  //     );
  //   })
  //   .catch((err) => console.error("❌ MongoDB connection error:", err));
}

{
  // const express = require("express");
  // const mongoose = require("mongoose");
  // const cors = require("cors");
  // const cookieParser = require("cookie-parser");
  // require("dotenv").config();
  // const authRoutes = require("./routes/auth"); // auth.js router
  // const userRoutes = require("./routes/userRoutes"); // agar users.js bo‘lsa shu yerga
  // const categoryRoutes = require("./routes/categoryRoutes");
  // const productRoutes = require("./routes/productRoutes");
  // const coruselRoutes = require("./routes/corusel");
  // const korzinkaRouter = require("./routes/korzinkaRouter");
  // const app = express();
  // // Middlewares
  // app.use(express.json());
  // app.use(cookieParser());
  // // CORS setup
  // app.use(
  //   cors({
  //     origin: "https://shopify-steel-two.vercel.app",
  //     credentials: true,
  //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  //     allowedHeaders: ["Content-Type", "Authorization"],
  //   })
  // );
  // app.options("*", cors());
  // // app.use(
  // //   cors({
  // //     origin: ["https://shopify-steel-two.vercel.app"],
  // //     credentials: true,
  // //   })
  // // );
  // // Routes
  // app.use("/api/cart", korzinkaRouter);
  // app.use("/api/auth", authRoutes);
  // app.use("/api/users", userRoutes);
  // app.use("/api/categories", categoryRoutes);
  // app.use("/api/products", productRoutes);
  // app.use("/api/corusel", coruselRoutes);
  // // MongoDB connect
  // mongoose
  //   .connect(process.env.MONGO_URI)
  //   .then(() => {
  //     console.log("✅ MongoDB connected");
  //     app.listen(process.env.PORT || 3000, () =>
  //       console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
  //     );
  //   })
  //   .catch((err) => console.error("❌ MongoDB connection error:", err));
}
