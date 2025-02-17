const { DB } = require("./databaseController");

class Client {
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
