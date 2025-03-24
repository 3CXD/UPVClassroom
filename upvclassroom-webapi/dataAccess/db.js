const mysql = require("mysql2/promise");
const dbConfig = require("./dbConfig.json");

const pool = mysql.createPool(dbConfig);
//const promisePool = pool.promise();

module.exports = {
    query: (sql, params) => pool.execute(sql, params)
};