const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./setup/passport-setup");

require("dotenv").config();
const app = express();

// Middleware for CORS
app.use(cors());

// Built-in middleware for json and urlencoded form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using https
  })
);

// Initialize passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Routes
const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");
app.use("/", userRoutes);
app.use("/api", listingRoutes);

// Adding a default path
app.get("/", (req, res) => {
  // Check if the user is logged in and greet them if they are
  if (req.user) {
    res.send(`Hello ${req.user.name}`);
  } else {
    res.send("Hello Guest");
  }
});

// Health check route
app.get("/healthCheck", (req, res) => {
  res.status(200).send("all good");
});

// Catch-all for unhandled routes
app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  res.status(404).json({ message: "Not found" });
});

module.exports = app;
