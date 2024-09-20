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

sequelize
  .sync({ alter: true }) // Use { force: true } if you want to drop and recreate tables
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Example isExist function
db.isExist = function (modelName, condition) {
  return new Promise(function (fulfill, reject) {
    db[modelName]
      .findOne({ where: condition })
      .then((exists) => {
        fulfill(exists?.id);
      })
      .catch((error) => {
        reject(1001);
      });
  });
};

// Example findOne function
db.findOne = function (modelName, condition, select, join) {
  return new Promise(function (fulfill, reject) {
    const options = {
      where: condition || {},
      attributes: select || undefined,
      include: join || undefined,
    };

    db[modelName]
      .findOne(options)
      .then((doc) => {
        fulfill(doc);
      })
      .catch((error) => {
        reject(1001);
      });
  });
};

// Example find function
db.find = function (modelName, condition, select, sort, page, limit, skip) {
  return new Promise(function (fulfill, reject) {
    const options = {
      where: condition || {},
      attributes: select || undefined,
      order: sort ? [sort] : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: skip
        ? parseInt(skip)
        : page
        ? (page - 1) * parseInt(limit)
        : undefined,
    };

    db[modelName]
      .findAll(options)
      .then((docs) => {
        fulfill(docs);
      })
      .catch((error) => {
        reject(1001);
      });
  });
};

// Example insert function
db.insert = function (modelName, data) {
  return new Promise(function (fulfill, reject) {
    db[modelName]
      .create(data)
      .then((doc) => {
        fulfill(doc);
      })
      .catch((error) => {
        reject(1001);
      });
  });
};

// Example update function
db.update = function (modelName, condition, update, options = {}) {
  return new Promise(function (fulfill, reject) {
    db[modelName]
      .update(update, { where: condition, ...options })
      .then(([rowsUpdated]) => {
        fulfill(rowsUpdated);
      })
      .catch((error) => {
        reject(1001);
      });
  });
};

// Example delete function
db.delete = function (modelName, condition, multi) {
  return new Promise(function (fulfill, reject) {
    const options = { where: condition };
    if (multi) {
      db[modelName]
        .destroy(options)
        .then((deletedCount) => {
          fulfill(deletedCount);
        })
        .catch((error) => {
          reject(1001);
        });
    } else {
      db[modelName]
        .destroy({ where: condition, limit: 1 })
        .then((deletedCount) => {
          fulfill(deletedCount);
        })
        .catch((error) => {
          reject(1001);
        });
    }
  });
};

module.exports = db;
