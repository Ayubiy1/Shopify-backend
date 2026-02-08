{
  // const jwt = require("jsonwebtoken");
  // const User = require("../models/User");
  // const Seller = require("../models/Seller");
  // const authMiddleware = async (req, res, next) => {
  //   try {
  //     const authHeader = req.headers.authorization;
  //     if (!authHeader)
  //       return res.status(401).json({ message: "No token provided" });
  //     const token = authHeader.split(" ")[1]; // "Bearer token" → token
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     const user = await User.findById(decoded.id);
  //     if (!user) return res.status(401).json({ message: "Invalid user" });
  //     req.user = user;
  //     next();
  //   } catch (error) {
  //     return res
  //       .status(401)
  //       .json({ message: "Unauthorized", error: error.message });
  //   }
  // };
  // const authMiddlewarae = (req, res, next) => {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({ message: "No token provided" });
  //   }
  //   const token = authHeader.split(" ")[1];
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     req.user = decoded; // { _id, role, ... }
  //     next();
  //   } catch (err) {
  //     return res.status(401).json({ message: "Token invalid" });
  //   }
  // };
  // // Admin
  // const adminMiddleware = async (req, res, next) => {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader)
  //     return res.status(401).json({ message: "No token provided" });
  //   const token = authHeader.split(" ")[1]; // "Bearer token" → token
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.id);
  //   if (!user) return res.status(401).json({ message: "Invalid user" });
  //   if (user.role !== "admin") {
  //     return res.status(403).json({ message: "Kirish uchun ruxsat yo‘q!!!" });
  //   }
  //   next();
  // };
  // // Seller
  // const sellerMiddleware = async (req, res, next) => {
  //   const authHeader = req.headers.authorization;
  //   if (!authHeader)
  //     return res.status(401).json({ message: "No token provided" });
  //   const token = authHeader.split(" ")[1]; // "Bearer token" → token
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   // const seller = await User.findById({ additionId: decoded.id.toString() });
  //   const user = await User.findById(decoded.id);
  //   // console.log(decoded.id);
  //   const seller = await Seller.findById(user.additionId);
  //   if (!seller) return res.status(401).json({ message: "Invalid seller" });
  //   // console.log(seller);
  //   if (seller.role !== "seller") {
  //     return res
  //       .status(403)
  //       .json({ message: "Ruxsat yo‘q. Faqat seller kirishi mumkin." });
  //   }
  //   next();
  // };
  // module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };
}

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

{
  // router.post("/register", async (req, res) => {
  //   try {
  //     const { fullName, email, password, role, additionId } = req.body;
  //     const existingUser = await User.findOne({ email: email.toLowerCase() });
  //     if (existingUser)
  //       return res.status(400).json({ message: "User already exists" });
  //     const hashed = await bcrypt.hash(password, 10);
  //     if (role !== "seller") {
  //       const newUser = new User({
  //         fullName,
  //         email: email.toLowerCase(),
  //         password: hashed,
  //         role: role || "buyer" || "seller",
  //       });
  //       await newUser.save();
  //       return res.status(201).json({
  //         user: {
  //           id: newUser._id,
  //           fullName: newUser.fullName,
  //           email: newUser.email,
  //           role: newUser.role,
  //         },
  //       });
  //     } else {
  //       const newUserSeller = new User({
  //         fullName,
  //         email: email.toLowerCase(),
  //         password: hashed,
  //         additionId: additionId,
  //         role: role || "buyer" || "seller",
  //       });
  //       await newUserSeller.save();
  //       return res.status(201).json({
  //         user: {
  //           id: newUserSeller._id,
  //           fullName: newUserSeller.fullName,
  //           email: newUserSeller.email,
  //           role: newUserSeller.role,
  //           additionId: newUserSeller.additionId,
  //         },
  //       });
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
}

{
  // router.post("/login", async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const user = await User.findOne({ email });
  //     if (!user) return res.status(400).json({ message: "User not found" });
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(400).json({ message: "Wrong password" });
  //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //       expiresIn: "7d",
  //     });
  //     // 🔴 COOKIE YO‘Q
  //     res.json({
  //       token,
  //       user: {
  //         id: user._id,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(500).json({ message: "Login error" });
  //   }
  // });
}

{
  // router.post("/login", async (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     const user = await User.findOne({ email: email.toLowerCase() });
  //     if (!user) return res.status(400).json({ message: "Email topilmadi" });
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(400).json({ message: "Parol noto'g'ri" });
  //     const accessToken = generateAccessToken(user);
  //     const refreshToken = generateRefreshToken(user);
  //     user.refreshToken = refreshToken;
  //     await user.save();
  //     // 🍪 COOKIE
  //     res.cookie("token", accessToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "none",
  //       maxAge: 60 * 60 * 1000,
  //     });
  //     return res.json({
  //       accessToken, // 🔥 TOKEN FRONTENDGA KETADI!
  //       refreshToken,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         role: user.role,
  //         additionId: user.additionId,
  //       },
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // });
}

{
  // router.post("/google", async (req, res) => {
  //   try {
  //     const { token } = req.body;
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID,
  //     });
  //     const payload = ticket.getPayload();
  //     const { email, name, sub: googleId } = payload;
  //     let user = await User.findOne({ email });
  //     // Yangi user yaratamiz
  //     console.log(user);
  //     if (!user) {
  //       user = await User.create({
  //         fullName: name,
  //         email,
  //         googleId,
  //       });
  //     }
  //     // TOKENLAR GENERATSIYASI
  //     const accessToken = generateAccessToken(user);
  //     const refreshToken = generateRefreshToken(user);
  //     user.refreshToken = refreshToken;
  //     await user.save();
  //     // COOKIEga ACCESS TOKEN YOZILADI
  //     res.cookie("token", accessToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: "none",
  //       maxAge: 60 * 60 * 1000,
  //     });
  //     return res.json({
  //       accessToken,
  //       refreshToken,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(401).json({ message: "Invalid Google token" });
  //   }
  // });
  // REFRESH TOKEN
}

{
  // router.post("/google", async (req, res) => {
  //   const { token } = req.body;
  //   try {
  //     console.log("Token:", token);
  //     console.log("Backend Client ID:", process.env.GOOGLE_CLIENT_ID);
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: process.env.GOOGLE_CLIENT_ID, // frontend Client ID bilan bir xil
  //     });
  //     const payload = ticket.getPayload();
  //     const { email, name, sub: googleId } = payload;
  //     let user = await User.findOne({ email });
  //     if (!user) {
  //       user = await User.create({
  //         fullName: name,
  //         email,
  //         googleId,
  //         password: null,
  //       });
  //     }
  //     const accessToken = generateAccessToken(user);
  //     const refreshToken = generateRefreshToken(user);
  //     user.refreshToken = refreshToken;
  //     await user.save();
  //     res.cookie(token, accessToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: true,
  //       maxAge: 60 * 60 * 1000,
  //     });
  //     res.json({
  //       accessToken,
  //       refreshToken,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         role: user.role,
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(401).json({ message: "Invalid token" });
  //   }
  // });
}
