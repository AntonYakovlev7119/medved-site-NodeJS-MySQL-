require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const favicon = require("serve-favicon");
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const clientRoute = require("./routes/clientRoute");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

const ApiError = require("./models/Error");
const { DB } = require("./controllers/databaseController");
const { pool } = require("./models/DB");

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
app.use((req, res, next) => {
  const jwt = require("jsonwebtoken");
  const secret = process.env.SECRET;

  try {
    const token = req.cookies.jwt;
    if (!token && req.baseUrl === "/admin") {
      return next(ApiError.badRequest("Такой страницы не существует"));
    }
    if (!token) return next();

    const decodedData = jwt.verify(token, secret);
    res.locals.user = decodedData;
    next();
  } catch (e) {
    return next(new ApiError(err.status, err.message));
  }
});

app.get("/test", async (req, res, next) => {
  try {
    let DBContent = await DB.getAllPagesContent();

    if (DBContent instanceof Error) throw DBContent;

    return res.json(DBContent);
  } catch (err) {
    return next(err);
  }

  // await DB.getAllPagesContent().then((data) => {
  //   return (DBContent = data);
  // });
});

app.get("/", authMiddleware, async (req, res, next) => {
  try {
    res.render("index", {
      content: global.cachedCmsContent.sortedCmsContent.index,
      req,
    });
  } catch (err) {
    return next(new ApiError(err));
  }
});

app.get("/catalog", authMiddleware, async (req, res, next) => {
  try {
    res.render("./pages/catalog", {
      content: global.cachedCmsContent.sortedCmsContent.catalog,
      products: global.cachedCmsContent.products,
      req,
    });
  } catch (err) {
    return next(new ApiError(err));
  }
});

app.get("/contacts", authMiddleware, async (req, res, next) => {
  try {
    res.render("./pages/contacts", {
      content: global.cachedCmsContent.sortedCmsContent.contacts,
      req,
    });
  } catch (err) {
    return next(new ApiError(err));
  }
});

app.use(authRoute);
app.use("/admin", adminRoute);
app.use(clientRoute);

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
