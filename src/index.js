const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const { default: mongoose } = require("mongoose");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);

// boshqa middlewarelardan keyin:
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Shopify Backend API running...");
});

const PORT = process.env.PORT || 10000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
