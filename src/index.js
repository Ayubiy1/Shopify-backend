// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// dotenv faqat localda ishlaydi, Koyeb deploy uchun Environment Variables ishlatiladi
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

// Express app
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS
app.use(
  cors({
    origin: [
      "https://shopify-backend-vcnq.onrender.com",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/cart", korzinkaRouter);
app.use("/api/admin", adminPanelRouter);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/corusel", coruselRoutes);
app.use("/api/sellers", sellerRouters);
app.use("/api/stock-history", stockHistory);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

if (!MONGO_URI) {
  console.error(
    "❌ MONGO_URI is not defined! Set it in Environment Variables."
  );
  process.exit(1); // serverni to‘xtatadi
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
