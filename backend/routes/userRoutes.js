const express = require("express");
const passport = require("passport");
const verifyToken = require("../middleware/verifyToken.js");
const {
  signUpUser,
  loginUser,
  getUserDetails,
} = require("../controllers/userController");

const router = express.Router();

router.post("/users/signup", signUpUser);
router.post("/users/login", loginUser);
router.get("/users/details/:userId", verifyToken, getUserDetails);

// Redirects to the google login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Google callback route hit. User:", req.user);
    // Successful authentication, redirect home.
    res.redirect("http://localhost:8000/login/oauth2/code/google");
  }
);

module.exports = router;
