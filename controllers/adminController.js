const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("medvedDB.db");
const fs = require("fs");
const Content = require("../models/Content");
const ApiError = require("../models/Error");

let content = null;
let products = [];
let orders = [];
let DBChanges = {
  isChanged: false,
  changes: [],
};
let cmsContent = null;

// Content.getAllPagesContent().then((data) => {
//   return (cmsContent = data);
// });
(async function () {
  cmsContent = await Content.getAllPagesContent();
})();

// getDataFromDateBase();
//  DBChanges.isChanged =true;
//         module.exports.DBChanges = DBChanges;
//         console.log(module);
//         setTimeout(()=>DBChanges.isChanged = false, 5000)

class Admin {
  static getCmsPage(req, res, next) {
    try {
      return res.render("admin", { req });
    } catch (err) {
      err.status = 500;
      return next(new ApiError(err.status, err.message));
    }
  }

  static getCmsListContent(req, res, next) {
    return res.json(cmsContent);
  }

  static async saveCmsChanges(req, res, next) {
    const data = req.body;
    const cmsContentChanges = Object.entries(data);

    try {
      const dbRequest = await Content.updateCmsData(cmsContentChanges);

      cmsContent = await Content.getAllPagesContent();

      return res.status(200).json(dbRequest);
    } catch (err) {
      return res.status(err.status).json(err);
    }
  }

  static async getСatalogPage(req, res, next) {
    try {
      const product_id = req.query.product_id;

      products = await Content.getProducts();

      if (product_id) {
        products.forEach((elem) => {
          if (elem.id == product_id) {
            return res.json(elem);
          }
        });
      }

      return res.render("admin", { req, products });
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }

  static async getOrdersPage(req, res, next) {
    try {
      orders = await Content.getAllOrders();

      return res.render("admin", { req, orders });
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }

  static signOut(req, res) {
    res.clearCookie("jwt");
    return res.redirect("/login");
  }

  static async createProduct(req, res, next) {
    try {
      const product_title = req.body.product__name;
      const product_desc = req.body.product__description;
      const product_price = req.body.product__price;
      let product_img = req.file;

      if (!product_img) {
        product_img = "no_img.jpg";
      } else {
        product_img = product_img.filename;
      }

      db.run(
        "INSERT INTO products (title, description, price, img) VALUES (?,?,?,?)",
        product_title,
        product_desc,
        product_price,
        product_img
      );

      res.redirect("/admin/catalog_management");
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }

  static async editProduct(req, res, next) {
    try {
      const product_id = req.params.id;
      const product_title = req.body.product__name;
      const product_desc = req.body.product__description;
      const product_price = req.body.product__price;
      let product_img_file = req.file;

      if (!product_img_file) {
        db.run(
          "UPDATE products SET title=?, description=?, price=? WHERE id=?",
          product_title,
          product_desc,
          product_price,
          product_id
        );
      } else {
        product_img_file = product_img_file.filename;
        db.run(
          "UPDATE products SET title=?, description=?, price=?, img=? WHERE id=?",
          product_title,
          product_desc,
          product_price,
          product_img_file,
          product_id
        );
      }

      res.redirect("/admin/catalog_management");
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const product_id = req.params.id;
      const product_img = req.query.img;

      if (product_img !== "no_img.jpg")
        fs.unlinkSync(`./public/product_images/${product_img}`);

      db.run("DELETE FROM products WHERE id=?", product_id);

      res.redirect("/admin/catalog_management");
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }
}

module.exports = { Admin };
