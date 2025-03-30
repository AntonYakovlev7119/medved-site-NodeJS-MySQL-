const ApiError = require("../models/Error");
const fs = require("fs/promises");

module.exports = async (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.render("error", {
      err: err.status,
      message: err.message,
    });
  }

  console.error(err);

  await fs.appendFile(
    "./logs/ApiError-log.txt",
    `${new Date().toLocaleString("ru")}: ${err.status} - ${err.stack}\n`,
    "utf-8"
  );

  return res.render("error", { err: 500, message: "Непредвиденная ошибка" });
};
