const { DB } = require("../database/database-controller");
const ApiError = require("../utils/api-error");

class Client {
  static async getIndex(req, res, next) {
    try {
      res.render("index", {
        content: global.cachedCmsContent.sortedCmsContent.index,
        req,
      });
    } catch (err) {
      return next(ApiError.internalError(err));
    }
  }

  static async getCatalog(req, res, next) {
    try {
      res.render("./pages/catalog", {
        content: global.cachedCmsContent.sortedCmsContent.catalog,
        products: global.cachedCmsContent.products,
        req,
      });
    } catch (err) {
      return next(ApiError.internalError(err));
    }
  }

  static async getContacts(req, res, next) {
    try {
      res.render("./pages/contacts", {
        content: global.cachedCmsContent.sortedCmsContent.contacts,
        req,
      });
    } catch (err) {
      return next(ApiError.internalError(err));
    }
  }

  static async getOrder(req, res, next) {
    const id = req.query.id;
    const data = await DB.getClientOrder(id);
    const order_content = JSON.parse(data);

    res.render("./__blocks/__order", { order: order_content });
  }

  static createCartOrder(req, res, next) {
    try {
      const client_cart = req.body;

      DB.createCartOrder(client_cart);
    } catch (err) {
      return next(new ApiError(err.status, err.message));
    }
  }

  static getCart(req, res) {
    const cart = req.body;
    const cart_array = [];
    Object.values(cart).forEach((elem) => {
      cart_array.push(elem);
    });

    res.render("./__blocks/__cart-inner", { products: cart_array });
  }
}

module.exports = { Client };
