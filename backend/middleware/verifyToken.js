const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("Authorization failed, no token provided");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.id };

    next();
  } catch (error) {
    console.error("Token Verification Failed:", error);
    return res.status(401).json({ message: "Authorization failed" });
  }
};

module.exports = verifyToken;
