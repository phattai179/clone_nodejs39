// import mysql from "mysql2";
// let connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "1234",
//   port: "3306",
//   database: "db_youtube",
// });

import { Sequelize } from "sequelize";
import config from "../config/config.js";

const sequelize = new Sequelize(config.database, config.user, config.pass, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

export default sequelize;
