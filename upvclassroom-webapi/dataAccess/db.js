//const mysql = require("mysql2");
//const dbConfig = require("./dbConfig.json");

import mysql from 'mysql2';
//import dbConfig from './dbConfig2.json' assert {type: 'json'};
import fs from 'fs';
const dbConfig = JSON.parse(fs.readFileSync('./dataAccess/dbConfig2.json', 'utf8'));

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

export default {promisePool};