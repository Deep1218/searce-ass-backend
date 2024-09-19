const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const db = require("../lib/database");
const global = require("../config/global");

const ISSUER = process.env.ISSUER || "";

module.exports = {
  get: function (payload, exp = "7d") {
    //* read private key
    const privateKey = fs.readFileSync(
      path.join(__dirname, "../ssh/jwtRS256.key"),
      "utf8"
    );
    //* generate token
    return jwt.sign(payload, privateKey, {
      expiresIn: exp,
      issuer: ISSUER,
      algorithm: "RS256",
    });
  },
  verify: function (requestToken) {
    try {
      //* read public key
      const publicKey = fs.readFileSync(
        path.join(__dirname, "../ssh/jwtRS256.key.pub"),
        "utf8"
      );
      //* verify token
      const token = jwt.verify(requestToken, publicKey, {
        issuer: ISSUER,
        algorithms: ["RS256"],
      });
      return Promise.resolve(token);
    } catch (error) {
      return Promise.reject(1001);
    }
  },
  verifyAccessToken: function (req) {
    try {
      //* read public key
      const publicKey = fs.readFileSync(
        path.join(__dirname, "../ssh/jwtRS256.key.pub"),
        "utf8"
      );

      //* read header
      const auth = req.headers["authorization"];
      if (!auth) {
        return Promise.reject(401);
      }
      const requestToken = auth.split(/\s+/).pop();
      //* verify token
      const token = jwt.verify(requestToken, publicKey, {
        issuer: ISSUER,
        algorithms: ["RS256"],
      });

      if (!token || !token.tokenId) {
        return Promise.reject(401);
      }

      //* validate user
      return db
        .findOne(global.dbCollection.ACCESSTOKEN, { _id: token.tokenId })
        .then((d) => {
          if (!d) {
            return Promise.reject(401);
          }

          // check token is live
          let ttl = moment.utc(moment.utc(d.created) + d.ttl);
          let created = moment.utc(d.created);
          if (!moment.utc().isBetween(created, ttl)) {
            return Promise.reject(401);
          }
          return Promise.resolve(token);
        });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  TTL: function () {
    return 1000 * 60 * 60 * 24 * 7; //ms s m h d
  },
};
