const mysql = require("mysql2");

const dbPoolConfig = {
  connectionLimit: 20,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
  password: process.env.MYSQL_PASSWORD,
};

const pool = mysql.createPool(dbPoolConfig).promise();

exports.pool = pool;

const dbRequest = async (sql, data, dbAction, connection) => {
  if (!connection) {
    return pool
      .query(sql, data)
      .then((result) => {
        if (dbAction) {
          return dbAction(result);
        } else {
          return result;
        }
      })
      .catch((err) => {
        dbErrorHandler(err);

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
        dbErrorHandler(err);

        throw new Error();
      });
  }
};

const dbErrorHandler = async (error) => {
  // console.error(error);
};

exports.dbRequest = dbRequest;
exports.dbErrorHandler = dbErrorHandler;
