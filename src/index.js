// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const coruselRoutes = require("./routes/corusel");
const korzinkaRouter = require("./routes/korzinkaRouter");
const adminPanelRouter = require("./routes/adminPanelRouter");
const sellerRouters = require("./routes/sellerRouters");
const stockHistory = require("./routes/stockHistoryRoutes");
const resetPassword = require("./routes/resetPassword");

const app = express();

/* 🔴 CORS — ENG BIRINCHI */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://shopify-steel-two.vercel.app",
      "https://shopifiy.uz",
      "https://www.shopifiy.uz",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: false, // 🔴 TOKEN BO‘LGANI UCHUN FALSE
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  }),
);

/* 🔴 PREFLIGHT */
app.options("*", cors());

/* Middlewares */
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("welcome to express");
});

/* Routes */
app.use("/api/cart", korzinkaRouter);
app.use("/api/admin", adminPanelRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/corusel", coruselRoutes);
app.use("/api/sellers", sellerRouters);
app.use("/api/stock-history", stockHistory);
app.use("/api/reset-password", resetPassword);

/* DB */
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
