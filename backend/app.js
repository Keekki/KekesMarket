const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./setup/passport-setup");

require("dotenv").config();
const path = require("path");
const app = express();

const corsOptions = {
  origin: "https://kekesmarket.onrender.com",
  optionsSuccessStatus: 200,
};

// Middleware for CORS
app.use(cors(corsOptions));

// Built-in middleware for json and urlencoded form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

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
