const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("medvedDB.db");
const { get } = require("../routes/authRoute");
const ApiError = require("./Error");

class Content {
  static getPageContentSortedByPage() {
    try {
      return new Promise((res, rej) => {
        const content = {};
        db.all("SELECT page, section, content FROM cms_data", (err, data) => {
          if (err) rej(err);
          data.forEach((elem) => {
            if (content.hasOwnProperty(elem.page)) {
              content[elem.page][elem.section] = elem.content;
            } else {
              content[elem.page] = {
                [elem.section]: elem.content,
              };
            }
          });
          res(content);
        });
      });
    } catch (err) {
      return ApiError.badRequest(
        "Не удалось получить данные страницы из базы данных"
      );
    }
  }

  static async getAllPagesContent() {
    const getData = new Promise((res, rej) => {
      const content = {};

      db.all("SELECT * FROM cms_data", (err, data) => {
        if (err) return rej(err);
        data.forEach((elem) => {
          content[elem.section] = {
            title: elem.name,
            content: elem.content,
          };
        });
        // console.log(content);
        return res(content);
      });
    }).catch((err) => {
      return ApiError.internalError(
        "Не удалось получить данные страницы из базы данных"
      );
    });

    return getData;
  }

  static getProducts() {
    try {
      // const error = new Error("УУУУУУпс!");

      // return rej(error);
      return new Promise((res, rej) => {
        const products = [];
        db.all("SELECT * FROM products", (err, data) => {
          data.forEach((elem) => {
            products.push({
              id: elem.id,
              title: elem.title,
              desc: elem.description,
              price: elem.price,
              img: elem.img,
            });
          });
          res(products);
        });
      });
    } catch (err) {
      return ApiError.badRequest(
        "Не удалось получить данные продукции из базы данных"
      );
    }
  }

  static getAllOrders() {
    try {
      return new Promise((res, rej) => {
        const orders = [];
        db.all("SELECT * FROM orders", (err, data) => {
          data.forEach((elem) => {
            orders.push({
              id: elem.id,
              client: elem.client,
              telephone: elem.telephone,
              cart: elem.cart,
              cart_count: elem.cart_count,
              order_notes: elem.order_notes,
              request_type: elem.request_type,
              status: elem.status,
              date: elem.date,
            });
          });
          res(orders);
        });
      });
    } catch (err) {
      return ApiError.badRequest(
        "Не удалось получить данные продукции из базы данных"
      );
    }
  }

  static async getClientOrder(order_id) {
    const id = order_id;
    return new Promise((res, rej) => {
      db.get("SELECT cart FROM orders WHERE id=?", id, (err, data) => {
        res(data.cart);
      });
    });
  }

  static createCartOrder(client_cart) {
    try {
      const cart = client_cart;
      const cart_order = JSON.stringify(cart.cart);

      db.run(
        "INSERT INTO orders (client, telephone, cart, cart_count, order_notes, request_type, status, date) VALUES (?,?,?,?,?,?,?, strftime('%Y-%m-%d', date('now')))",
        cart.name,
        cart.telephone,
        cart_order,
        cart.cart_count,
        cart.order_notes,
        "корзина",
        "new"
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  static async updateCmsData(data) {
    const cmsChanges = data;
    const cmsRequests = [
      new Promise((res, rej) => {
        db.run(
          "UPDATE cms_data1 SET content=? WHERE section=?",
          [
            "Мы производим различные древесные изделия по доступным ценам. В ассортимент нашей продукции входят дрова, доски, брусья, пластины и другие изделия. Также мы предоставляем услуги по расчистке древесных насаждений. Мы гарантируем высокое качество нашей продукции и доступные цены!",
            "company_desc",
          ],

          (err) => {
            console.log(1);
            if (err) {
              rej(new ApiError(500, err.message));
            }
            res();
            // console.log(elem[1], elem[0]);
          }
        );
      }),
    ];

    cmsChanges.forEach((elem) => {
      const promise = new Promise((res, rej) => {
        db.run(
          "UPDATE cms_data SET content=? WHERE section=?",
          [elem[1], elem[0]],
          (err) => {
            if (err) {
              console.log(2);
              rej(new ApiError(500, err.message));
            }
            res();
            // console.log(elem[1], elem[0]);
          }
        );
      });
      // .catch((err) => {
      //   console.log(err.message);
      // });

      cmsRequests.push(promise);
    });

    Promise.all(cmsRequests)
      .then(() => {
        console.log("fd");
      })
      .catch((err) => {
        console.log(err);
        db.close();
      });

    // [
    //   {
    //     $section: "header_desc",
    //     $content:
    //       "Доставка дров, древесных изделий, перевозка грузов, расчистка участков от древесных насаждений fdfdfdf",
    //   },
    //   { $section: "email", $content: "medved-vyborg@yandex.rudfdf" },],

    //     Мы производим различные древесные изделия по доступным ценам. В
    //             ассортимент нашей продукции входят дрова, доски, брусья, пластины и
    //             другие изделия. Также мы предоставляем услуги по расчистке древесных
    //             насаждений.
    // Мы гарантируем высокое качество нашей продукции и доступные
    //             цены!
  }

  static test() {
    try {
    } catch (err) {
      next(
        ApiError.badRequest(
          "Не получилось получить данные продукции из базы данных"
        )
      );
    }
  }
}

module.exports = Content;
