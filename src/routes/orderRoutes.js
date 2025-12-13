const router = require("express").Router();
const { createOrder } = require("../controllers/orderController");

router.post("/create", createOrder);

module.exports = router;
