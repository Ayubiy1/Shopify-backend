const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const { default: mongoose } = require("mongoose");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Shopify Backend API running...");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
