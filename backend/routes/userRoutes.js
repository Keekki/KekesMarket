const express = require("express");
const passport = require("passport");
const verifyToken = require("../middleware/verifyToken.js");
const {
  signUpUser,
  loginUser,
  getUserDetails,
  getPublicUserDetails,
} = require("../controllers/userController");

const router = express.Router();

router.post("/users/signup", signUpUser);
router.post("/users/login", loginUser);
router.get("/users/details/:userId", verifyToken, getUserDetails);
router.get("/users/public/:userId", getPublicUserDetails);

// Redirects to the google login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/login/oauth2/callback",
  (req, res, next) => {
    console.log("Callback URL hit with query:", req.query);
    next();
  },
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  (req, res) => {
    console.log("Authentication successful, user:", req.user);
    res.redirect("/");
  }
);

module.exports = router;
