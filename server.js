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
const { Content, pool } = require("./models/Content");

let cmsContent = null;
let products = null;

setInterval(async () => {
  cmsContent = await Content.getPageContentSortedByPage();
  products = await Content.getProducts();
}, 5000);

// setInterval(async () => {
//   let DBChanges = require("./controllers/adminController").DBChanges;

//   if (DBChanges && DBChanges.isChanged && DBChanges.changes.length !== 0) {
//   }
// }, 2500);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(favicon(path.join("public", "./img/logo/favicon.ico")));

app.get("/test", async (req, res, next) => {
  try {
    let DBContent = await Content.getAllPagesContent();

    if (DBContent instanceof Error) throw DBContent;

    return res.json(DBContent);
  } catch (err) {
    return next(err);
  }

  // await Content.getAllPagesContent().then((data) => {
  //   return (DBContent = data);
  // });
});

app.get("/test2", async (req, res) => {
  const result = await Content.getPageContentSortedByPage();

  res.json(result);
});

app.get("/test4", (req, res) => {
  res.render("./test");
});

app.post("/test4", (req, res) => {
  try {
    const data = req.body;

    console.log(data);
  } catch (err) {
    return next(err);
  }
});

// app.get("/test3", async (req, res) => {
//   const result = Content.requestToDB2(
//     // "UPDATE cms_data SET content='новый контент' WHERE section='wood3' "
//     "SELECT * FROM cms_data"
//   );

//   res.json(result);
// });

app.get("/", authMiddleware, async (req, res, next) => {
  try {
    res.render("index", {
      content: cmsContent.index,
      req,
    });
  } catch (err) {
    return next(new ApiError(err));
  }
});

app.get("/catalog", authMiddleware, async (req, res, next) => {
  try {
    res.render("./pages/catalog", {
      content: cmsContent.catalog,
      products,
      req,
    });
  } catch (err) {
    return next(new ApiError(err));
  }
});

app.get("/contacts", authMiddleware, async (req, res, next) => {
  try {
    res.render("./pages/contacts", {
      content: cmsContent.contacts,
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

let server;

(async function () {
  try {
    cmsContent = await Content.getPageContentSortedByPage();
    console.log("1.Pages content was successfully loaded from datebase");

    // setTimeout(() => {
    // products = require("./controllers/adminController").products;
    // console.log(products);
    // }, 2000);
    products = await Content.getProducts();
    console.log("2.Products were successfully loaded from datebase");

    server = app.listen(PORT, HOST, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    // console.log(err);
    return process.exit();
  }
})();

process.on("SIGINT", () => {
  console.log("SIGINT signal received.");

  server.close(() => {
    console.log("Closed out remaining connections");

    pool.end((err) => {
      console.log("Database connections are closed");
    });

    process.exit();
  });
});
