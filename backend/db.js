const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "juan",
  password: "1234",
  database: "basedatos"
});

console.log("Conectado a MariaDB");

module.exports = db;