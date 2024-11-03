const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { getAuth, postAuth } = require("../controllers/authController");

router.get("/login", getAuth);
router.post(
  "/login",
  [
    check(
      "password",
      "Пароль должен быть больше 4 и меньше 10 символов"
    ).isLength({ min: 4, max: 10 }),
  ],
  postAuth
);

module.exports = router;
