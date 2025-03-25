const mysql = require("mysql2");
const dbConfig = require("./dbConfig.json");

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = promisePool;