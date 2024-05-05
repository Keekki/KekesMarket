const express = require("express");
const jwt = require("jsonwebtoken");
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
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    // Redirect with token to frontend
    res.redirect(`${process.env.FRONTEND_URL}/auth-handler?token=${token}`);
  }
);

module.exports = router;
