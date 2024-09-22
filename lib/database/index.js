const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    timezone: "+00:00",
    logging: process.env.IS_PRODUCTION !== "false",
    define: {
      timestamps: true,
    },
  }
);

const db = {};
let dbClient = null;

const dbConnection = function () {
  return new Promise(function (fulfill, reject) {
    if (dbClient == null) {
      sequelize
        .authenticate()
        .then(() => {
          console.log("DATABASE CONNECTED SUCCESSFULLY");
          dbClient = sequelize;
          fulfill(dbClient);
        })
        .catch((error) => {
          console.error("Unable to connect to the database:", error);
          reject(error);
        });
    } else {
      fulfill(dbClient);
    }
  });
};
dbConnection();

// Import models
db.Users = require("../models/users")(sequelize, DataTypes);
db.Projects = require("../models/projects")(sequelize, DataTypes);
db.Planners = require("../models/planners")(sequelize, DataTypes);
db.Positions = require("../models/positions")(sequelize, DataTypes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

db.sequelize = sequelize;
module.exports = db;
