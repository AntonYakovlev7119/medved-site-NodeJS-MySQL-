const fs = require("fs");
const { DB } = require("../database/database-controller");
const dbRequest = require("../database/DB").dbRequest;
const ApiError = require("../utils/api-error");

let orders = [];

class Admin {
  static getCmsPage(req, res) {
    try {
      return res.render("admin", { req });
    } catch (err) {
      return next(new ApiError(500, err.message));
    }
  }

  static getCmsListContent(req, res) {
    return res.json(global.cachedCmsContent.cmsContent);
  }

  static async saveCmsChanges(req, res) {
    try {
      const data = req.body;
      const cmsContentChanges = Object.entries(data);

      const request = await DB.updateCmsData(cmsContentChanges);

      return res.status(200).json(request);
    } catch (err) {
      console.log(err);

      return res.status(err.status).json(err.message);
    }
  }

  static async getСatalogPage(req, res, next) {
    try {
      const product_id = req.query.product_id;

      if (product_id) {
        global.cachedCmsContent.products.forEach((elem) => {
          if (elem.id == product_id) {
            return res.json(elem);
          }
        });
      }

      return res.render("admin", {
        req,
        products: global.cachedCmsContent.products,
      });
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }

  static async getOrdersPage(req, res, next) {
    try {
      orders = await DB.getAllOrders();

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
    const product_title = req.body.product__name;
    const product_desc = req.body.product__description;
    const product_price = req.body.product__price;
    let product_img = req.file;

    if (!product_img) {
      product_img = "no_img.jpg";
    } else {
      product_img = product_img.filename;
    }

    await dbRequest(
      "INSERT INTO products (title, description, price, img) VALUES (?,?,?,?)",
      [product_title, product_desc, product_price, product_img]
    )
      .then(() => res.redirect("/admin/catalog_management"))
      .catch((err) => {
        return next(new ApiError(err.status, err.message));
      });
  }

  static async editProduct(req, res, next) {
    try {
      const product_id = req.params.id;
      const product_title = req.body.product__name;
      const product_desc = req.body.product__description;
      const product_price = req.body.product__price;
      let product_img_file = req.file;

      new Promise(async (res, rej) => {
        if (!product_img_file) {
          await dbRequest(
            "UPDATE products SET title=?, description=?, price=? WHERE id=?",
            [product_title, product_desc, product_price, product_id]
          );
        } else {
          product_img_file = product_img_file.filename;
          await dbRequest(
            "UPDATE products SET title=?, description=?, price=?, img=? WHERE id=?",
            [
              product_title,
              product_desc,
              product_price,
              product_img_file,
              product_id,
            ]
          );
        }

        res();
      })
        .then(() => res.redirect("/admin/catalog_management"))

        .catch((err) => {
          return next(new ApiError(err.status, err.message));
        });
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const product_id = req.params.id;
      const product_img = req.query.img;

      if (product_img !== "no_img.jpg")
        fs.unlinkSync(`./public/product_images/${product_img}`);

      await dbRequest("DELETE FROM products WHERE id=?", [product_id]);

      res.redirect("/admin/catalog_management");
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }
}

module.exports = { Admin };
