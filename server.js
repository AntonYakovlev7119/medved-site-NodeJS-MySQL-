require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const clientRoute = require("./routes/clientRoute");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

const ApiError = require("./models/Error");
const Content = require("./models/Content");

let cmsContent = null;

// setTimeout(()=>{
// console.log(cmsContent.index);
// }, 1000);

setInterval(async () => {
  let DBChanges = require("./controllers/adminController").DBChanges;

  if (DBChanges && DBChanges.isChanged && DBChanges.changes.length !== 0) {
  }
}, 2500);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

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
  const result = await Content.requestToDB(
    // "UPDATE cms_data SET content='новый контент' WHERE section='wood3' "
    "SELECT * FROM cms_data"
  );

  res.json(result);
});

app.get("/test3", async (req, res) => {
  const result = Content.requestToDB2(
    // "UPDATE cms_data SET content='новый контент' WHERE section='wood3' "
    "SELECT * FROM cms_data"
  );

  res.json(result);
});

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
    const products = await Content.getProducts();

    //     setTimeout(()=>{
    // console.log(products);
    // }, 1000);
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
      content: cmsContent.catalog,
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

const server = app.listen(PORT, HOST, () => {
  // new Promise(async (res, rej) => {
  //   cmsContent = await Content.getPageContentSortedByPage();

  //   if (cmsContent instanceof Error) return rej(cmsContent);
  //   else {
  //     console.log("Pages content was successfully loaded from datebase");
  //     return res(cmsContent);
  //   }
  // })
  //   .catch((err) => {
  //     console.log(err);
  //     return process.exit();
  //   })
  //   .then(() => {
  //     return console.log(`Server is running on port ${PORT}`);
  //   });
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received.");

  server.close(() => {
    console.log("Closed out remaining connections");

    process.exit();
  });
});
