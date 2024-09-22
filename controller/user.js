const express = require("express");

const helper = require("../core/helper");
const db = require("../lib/database/");
const global = require("../config/global");
const { Op } = require("sequelize");

const userRouter = express.Router();
const user = {};

user.create = function (req, res) {
  const body = req.body;

  /* ------------Param Error-------------- */
  let promise = helper.paramValidate(
    {
      code: 1500,
      val: !body.email,
    },
    {
      code: 1501,
      val: !helper.isValidEmail(body.email),
    },
    {
      code: 1502,
      val: !body.password,
    },
    {
      code: 1505,
      val: !body.name,
    }
  );
  /* ------------------------------------- */

  promise
    .then(() => {
      return db.Users.findOne({ where: { email: body.email } });
    })
    .then((isExist) => {
      if (isExist) {
        return Promise.reject(1506);
      }
      return db.Users.create({
        name: body.name,
        email: body.email,
        password: helper.md5(body.password),
      });
    })
    .then((user) => {
      const { password, ...userDetails } = user.toJSON();
      helper.success(res, userDetails, 200);
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

//* delete user
user.delete = function (req, res) {
  const id = req.params.id;
  /* ------------Param Error-------------- */
  let promise = helper.paramValidate({ code: 1507, val: !id });
  /* ------------------------------------- */

  promise
    .then(() => {
      return db.delete(global.dbCollection.USERS, {
        _id: id,
      });
    })
    .then(() => {
      return helper.success(res, null, 200);
    })
    .catch((e) => {
      return helper.error(res, e);
    });
};

user.getAll = function (req, res) {
  const { user } = req;
  Promise.resolve()
    .then(() => {
      return db.Users.findAll({
        where: {
          id: {
            [Op.not]: user.id,
          },
        },
      });
    })
    .then((users) => {
      helper.success(res, users, 200);
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

module.exports = function (uri, app) {
  userRouter.get("/", user.getAll);
  userRouter.post("/create/", user.create);
  userRouter.delete("/:id", user.delete);
  app.use(uri, userRouter);
};
