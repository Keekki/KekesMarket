const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("./setup/passport-setup");

require("dotenv").config();
const app = express();
app.use(cors());

const userRoutes = require("./routes/userRoutes");

app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", userRoutes);

app.get("/healthCheck", (req, res) => {
  res.status(200).send("all good");
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

module.exports = app;
