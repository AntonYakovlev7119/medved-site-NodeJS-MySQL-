const express = require("express");
const router = express.Router();
const { Client } = require("../controllers/client-controller");
const authMiddleware = require("../middleware/auth-middleware");

router.get("/", authMiddleware, Client.getIndex);
router.get("/catalog", authMiddleware, Client.getCatalog);
router.get("/contacts", authMiddleware, Client.getContacts);

router.get("/get_order", Client.getOrder);
router.post("/get_cart", Client.getCart);
router.post("/create_cart_order", Client.createCartOrder);

module.exports = router;
