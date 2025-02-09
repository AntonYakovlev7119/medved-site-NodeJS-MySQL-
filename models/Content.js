const mysql = require("mysql2");
const { get } = require("../routes/authRoute");
const ApiError = require("./Error");

const dbPoolConfig = {
  connectionLimit: 20,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
};

// const dbConnectionlConfig = {
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   database: process.env.MYSQL_DATABASE,
//   password: process.env.MYSQL_PASSWORD,
// };

const pool = mysql.createPool(dbPoolConfig);
const promisePool = pool.promise();

class Content {
  static async getPageContentSortedByPage() {
    return Content.requestToDB(
      "SELECT page, section, content FROM cms_data",
      null,
      ([data]) => {
        const content = {};

        data.forEach((elem) => {
          if (content.hasOwnProperty(elem.page)) {
            content[elem.page][elem.section] = elem.content;
          } else {
            content[elem.page] = {
              [elem.section]: elem.content,
            };
          }
        });

        return content;
      }
    ).catch((err) => {
      throw ApiError.internalError(
        "Не удалось получить данные страницы из базы данных"
      );
    });
  }

  static async getAllPagesContent() {
    return Content.requestToDB("SELECT * FROM cms_data", null, ([data]) => {
      const content = {};

      data.forEach((elem) => {
        content[elem.section] = {
          title: elem.name,
          content: elem.content,
        };
      });

      return content;
    }).catch((err) => {
      return ApiError.internalError(
        "Не удалось получить данные страницы из базы данных"
      );
    });
  }

  static async getProducts() {
    return Content.requestToDB("SELECT * FROM products", null, ([data]) => {
      const products = [];

      data.forEach((elem) => {
        products.push({
          id: elem.id,
          title: elem.title,
          desc: elem.description,
          price: elem.price,
          img: elem.img,
        });
      });

      return products;
    }).catch((err) => {
      throw ApiError.internalError(
        "Не удалось получить данные продукции из базы данных"
      );
    });
  }

  static async getAllOrders() {
    return Content.requestToDB("SELECT * FROM orders", null, ([data]) => {
      const orders = [];

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

      return orders;
    }).catch((err) => {
      throw ApiError.internalError(
        "Не удалось получить данные заказов из базы данных"
      );
    });
  }
  '[{"id":"2","img":"no_img.jpg","title":"Брус двухактный","price":"1200","count":5},{"id":"4","img":"no_img.jpg","title":"Доски вагонка","price":"600","count":3}]';

  static async getClientOrder(order_id) {
    const id = order_id;

    return Content.requestToDB(
      "SELECT cart FROM orders WHERE id=?",
      [id],
      (data) => {
        console.log(data);

        return data[0][0].cart;
      }
    ).catch((err) => {
      throw ApiError.internalError(
        "Не удалось получить данные заказа из базы данных"
      );
    });
  }

  static async createCartOrder(client_cart) {
    const cart = client_cart;
    const cart_order = JSON.stringify(cart.cart);

    return Content.requestToDB(
      "INSERT INTO orders (client, telephone, cart, cart_count, order_notes, request_type, status, date) VALUES (?,?,?,?,?,?,?, strftime('%Y-%m-%d', date('now')))",
      cart.name,
      cart.telephone,
      cart_order,
      cart.cart_count,
      cart.order_notes,
      "корзина",
      "new"
    ).catch((err) => {
      console.log(err.message);
    });
  }

  static async updateCmsData(data) {
    const cmsChanges = data;

    const connection = await promisePool.getConnection();

    connection.beginTransaction();

    return Promise.all(createPromises())
      .then(() => {
        connection.commit();
        connection.release();

        return "Изменения упешно применены";
      })
      .catch((err) => {
        connection.rollback();
        connection.release();

        throw new ApiError(err.status, err.message);
      });

    function createPromises() {
      const promises = [];

      cmsChanges.forEach((change) => {
        const promise = new Promise(async (res, rej) => {
          await Content.requestToDB(
            "UPDATE cms_data SET content = ? WHERE section = ?",
            [change[1], change[0]],
            ([data]) => {
              if (data.affectedRows === 0) {
                console.log(data);
                Content.dbErrorHandler({
                  status: 401,
                  message: `Таких данных не существует: {${change[0]}: ${change[1]}}`,
                });

                rej({
                  status: 401,
                  message: `Таких данных не существует`,
                });
              } else {
                res();
              }
            },
            connection
          ).catch((err) => {
            rej({ status: 500, message: "Не удалось загрузить изменения" });
          });
        });

        promises.push(promise);
      });

      return promises;
    }
  }

  static async requestToDB(sql, data, dbAction, connection) {
    if (!connection) {
      return promisePool
        .query(sql, data)
        .then((result) => {
          if (dbAction) {
            return dbAction(result);
          } else {
            return result;
          }
        })
        .catch((err) => {
          Content.dbErrorHandler(err);

          throw new Error();
        });
    } else {
      return connection
        .query(sql, data)
        .then((result) => {
          if (dbAction) {
            return dbAction(result);
          } else {
            return result;
          }
        })
        .catch((err) => {
          Content.dbErrorHandler(err);

          throw new Error();
        });
    }
  }

  static dbErrorHandler(error) {
    console.error(error);
  }
}

module.exports = { Content, pool };
