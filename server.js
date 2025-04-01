require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const authRoute = require("./routes/auth-route");
const adminRoute = require("./routes/admin-route");
const clientRoute = require("./routes/client-route");

const errorHandler = require("./middleware/error-handler");

const { DB } = require("./database/database-controller");

const { pool } = require("./database/DB");

let server = null;

global.cachedCmsContent = {
  sortedCmsContent: null,
  cmsContent: null,
  products: null,
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(favicon(path.join("public", "./img/logo/favicon.ico")));

app.get("/test", async (req, res, next) => {
  try {
  } catch (err) {
    return next(err);
  }
});

app.use(clientRoute);
app.use("/admin", adminRoute);
app.use(authRoute);

//Обработка ошибок
app.use(errorHandler);

app.use((req, res) => {
  res.render("error", { err: 404, message: "Такой страницы не существует" });
});

async function startServer() {
  try {
    server = await new Promise(async (res, rej) => {
      global.cachedCmsContent.sortedCmsContent =
        await DB.getPageContentSortedByPage();
      console.log("Sorted pages content was successfully loaded from datebase");

      global.cachedCmsContent.cmsContent = await DB.getAllPagesContent();
      console.log("Raw pages content was successfully loaded from datebase");

      global.cachedCmsContent.products = await DB.getProducts();
      console.log("Products were successfully loaded from datebase");

      setInterval(async () => {
        global.cachedCmsContent = await DB.refreshCachedContent();
      }, 5000);

      res(
        app.listen(PORT, HOST, () => {
          console.log(`Server is running on port ${PORT}`);
        })
      );
    });
  } catch (err) {
    console.log(err);

    return process.exit();
  }
}

startServer();

process.on("SIGINT", () => {
  console.log("SIGINT signal received.");

  server.close(() => {
    console.log("Closed out remaining connections");

    pool.end(() => {
      console.log("Database connections are closed");
    });

    process.exit();
  });
});
