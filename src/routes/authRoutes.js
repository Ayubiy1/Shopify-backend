const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Authenticated user
router.get("/me", protect, getMe);

module.exports = router;

// const express = require("express");
// const { registerUser, loginUser } = require("../controllers/authController");

// const router = express.Router();

// // Register
// router.post("/register", registerUser);

// // Login
// router.post("/login", loginUser);

// module.exports = router;
