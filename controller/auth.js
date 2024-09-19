const express = require("express");
const authRouter = express.Router();
const db = require("../lib/database");
const helper = require("../core/helper");
const jwt = require("../core/jwt");

const auth = {};

auth.signIn = function (req, res) {
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
    }
  );
  /* ------------------------------------- */

  promise
    .then(() => {
      return db.Users.findOne({
        where: {
          email: body.email,
          password: helper.md5(body.password),
        },
      });
    })
    .then((user) => {
      if (!user) {
        return Promise.reject(1504);
      }

      //create token
      let tokenInfo = {
        id: user._id,
        email: user.email,
      };
      let token = jwt.get(tokenInfo);
      let u = {
        userId: user.id,
        email: user.email,
        token,
      };
      return Promise.resolve(u);
    })
    .then((u) => {
      helper.success(res, u, 200);
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

module.exports = function (uri, app) {
  authRouter.post("/login", auth.signIn);
  app.use(uri, authRouter);
};
