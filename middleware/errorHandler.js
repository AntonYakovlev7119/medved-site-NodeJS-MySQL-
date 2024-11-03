const ApiError = require("../models/Error");

module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.render("error", {
      err: err.status,
      message: err.message,
    });
  }
  console.log(err.status, err.message);
  return res.render("error", { err: 500, message: "Непредвиденная ошибка" });
};
