const express = require("express");
const router = express.Router();
const { Client } = require("../controllers/clientController");

router.get("/get_order", Client.getOrder);
router.post("/get_cart", Client.getCart);
router.post("/create_cart_order", Client.createCartOrder);

module.exports = router;
