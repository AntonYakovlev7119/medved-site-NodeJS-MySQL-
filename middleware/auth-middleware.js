const jwt = require("jsonwebtoken");
const ApiError = require("../utils/api-error");
const secret = process.env.SECRET;

module.exports = function (req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token && req.baseUrl === "/admin") {
      return next(ApiError.badRequest("Такой страницы не существует"));
    }

    if (!token) return next();

    const decodedData = jwt.verify(token, secret);
    req.user = decodedData;

    next();
  } catch (err) {
    return next(new ApiError(err.status, err.message));
  }
};
