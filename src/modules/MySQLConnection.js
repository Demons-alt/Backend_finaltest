const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "final_test",
}
,console.log('MySQL success Connected'));


exports.db = db;
