const mysql = require("mysql2");
const { get } = require("../routes/authRoute");
const ApiError = require("./Error");

const dbPoolConfig = {
  connectionLimit: 1,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
};

const dbConnectionlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
};

const pool = mysql.createPool(dbPoolConfig).promise();

class Content {
  // static getPageContentSortedByPage() {
  //   try {
  //     return new Promise((res, rej) => {
  //       const content = {};
  //       db.all("SELECT page, section, content FROM cms_data", (err, data) => {
  //         if (err) rej(err);
  //         data.forEach((elem) => {
  //           if (content.hasOwnProperty(elem.page)) {
  //             content[elem.page][elem.section] = elem.content;
  //           } else {
  //             content[elem.page] = {
  //               [elem.section]: elem.content,
  //             };
  //           }
  //         });
  //         res(content);
  //       });
  //     });
  //   } catch (err) {
  //     return ApiError.badRequest(
  //       "Не удалось получить данные страницы из базы данных"
  //     );
  //   }
  // }

  static async getPageContentSortedByPage() {
    try {
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
    // const cmsChanges = [
    //   ["aaa +7 (931) 432-55-44", "telephone"],
    //   ["г. Выборг, ул. Кривоносова, д. 13, офис 231", "adress1"],
    //   ["medved-vyborg@yandex.ru", "email"],
    // ];

    // console.log(cmsChanges);

    async function promiseRequest() {
      const start = performance.now();

      const promises = [];

      if (cmsChanges.length > 1) {
        // Исправлено: добавлена закрывающая фигурная скобка в конце блока
        const connection = mysql
          .createConnection(dbConnectionlConfig)
          .promise();

        cmsChanges.forEach((elem) => {
          const promise = new Promise((res, rej) => {
            try {
              async function request() {
                const [data] = await connection.query(
                  "UPDATE cms_data SET content = ? WHERE section = ?",
                  [elem[1], elem[0]]
                );

                if (data.affectedRows === 0) {
                  rej(new Error("Такой строки нет в таблице..."));
                } else {
                  res();
                }
              }

              request();
            } catch (err) {
              // rej(err);
            }
          });

          promises.push(promise);
        });

        await connection.beginTransaction();

        try {
          await Promise.all(promises)
            .then(async () => {
              await connection.commit();
            })
            .catch((err) => {
              console.log(err);
              connection.rollback();
            });
        } catch (err) {
          console.log(err);
          connection.rollback();
        } finally {
          connection.release();

          const end = performance.now();
          const time = end - start;
          console.log("Время: ", time);
        }
      }
    }

    // Исправлено: добавлен обработчик необработанных отклонений обещаний
    promiseRequest().catch((err) => {
      console.error("Необработанное отклонение обещания:", err);
    });

    // connection.release();
    // const start = new Date().getTime();

    // for await (const change of cmsChanges) {
    //   try {
    //     const [data] = await connection.query(
    //       "UPDATE cms_data SET content = ? WHERE section = ?",
    //       [change[1], change[0]]
    //     );

    //     if (data.affectedRows === 0) {
    //       connection.rollback();
    //       break;
    //     }
    //   } catch (err) {
    //     console.error(err);

    //     break;
    //   }
    // }

    // const end = performance.now();
    // const end = new Date().getTime();
    // const time = end - start;
    // console.log("Время: ", time);

    // console.log("Начало: ", start, "Конец: ", end);

    // console.timeEnd("func");

    // connection.release();

    // await connection.commit();

    // ==============

    // new Promise((res, rej) => {
    //   db.run(
    //     "UPDATE cms_data1 SET content=? WHERE section=?",
    //     [cmsChanges[1], cmsChanges[0]],
    //     (err) => {
    //       if (err) {
    //         isError = true;

    //         console.log(isError);
    //         rej(new ApiError(500, err.message));
    //       }
    //       res();
    //     }
    //   );
    // }).catch((err) => {
    //   console.log(err.message);
    // });

    // console.log([cmsChanges[0], cmsChanges[1]]);
    // } catch (err) {
    //   console.error(err);
    // }
    // if(isError) rej()

    // [
    //   {
    //     $section: "header_desc",
    //     $content:
    //       "Доставка дров, древесных изделий, перевозка грузов, расчистка участков от древесных насаждений fdfdfdf",
    //   },
    //   { $section: "email", $content: "medved-vyborg@yandex.rudfdf" },],
  }

  static async requestToDB(sql, dbAction) {
    const [result] = await pool.query(sql);

    return result;
  }

  static async dbErrorHandler(error) {}

  // static test() {
  //   try {
  //   } catch (err) {
  //     next(
  //       ApiError.badRequest(
  //         "Не получилось получить данные продукции из базы данных"
  //       )
  //     );
  //   }
  // }
}

module.exports = Content;
