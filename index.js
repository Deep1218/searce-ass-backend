require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

//set body parser to read body param
app
  .use(cors())
  .use(bodyParser.json({ limit: "5mb" }))
  .use(bodyParser.urlencoded({ limit: "5mb", extended: true }))
  .use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Get API working...");
});

const server = app
  .listen(process.env.SERVER_PORT, function () {
    console.log(
      "Server is running on http://localhost:" + process.env.SERVER_PORT
    );
  })
  .setTimeout(800000);

require("./core")(app, server);

module.exports = app;
