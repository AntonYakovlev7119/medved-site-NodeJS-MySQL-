const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/api-error");
const secret = process.env.SECRET;
const admin_password = process.env.ADMIN_PASSWORD;
const jwt_time = 24 * 60 * 60 * 1000;

function generateAccessToken(role) {
  const payload = { role };
  return jwt.sign(payload, secret, { expiresIn: jwt_time });
}

function getAuth(req, res) {
  const token = req.cookies.jwt;
  if (token) return res.redirect("/admin/cms");
  res.render("signIn", { message: null });
}

async function postAuth(req, res, next) {
  try {
    const password = req.body.password;
    const validPassword = bcrypt.compareSync(password, admin_password);

    if (!validPassword) {
      res.render("signIn", { message: "Введён неверный пароль" });
    }
    const token = generateAccessToken("admin");
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: jwt_time,
    });
    return res.redirect("/admin/cms");
  } catch (e) {
    return next(ApiError.loginError("Ошибка входа"));
  }
}

module.exports = { getAuth, postAuth };
