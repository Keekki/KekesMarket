const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/database.js");

const signUpUser = async (req, res) => {
  // Validation
  const { name, email, password, street, postalCode, city } = req.body;

  // Check if name, email, and password are present
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const results = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    if (results.length > 0) {
      return res.status(422).json({ message: "Email already exists" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password_hash: hashedPassword,
    street,
    postalCode,
    city,
  };

  try {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (id, name, email, password_hash, street, postalCode, city) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          newUser.id,
          newUser.name,
          newUser.email,
          newUser.password_hash,
          newUser.street,
          newUser.postalCode,
          newUser.city,
        ],
        (err) => {
          if (err) {
            console.error("Error inserting user: ", err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ id: newUser.id, email: newUser.email, token });
  } catch (error) {
    res.status(500).json({ message: "Signup didn't work" });
  }
};

const loginUser = async (req, res) => {
  // Validation
  const { email, password } = req.body;

  // Check if email and password are present
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const results = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    if (results.length === 0) {
      return res.status(401).json({ message: "Could not identify user" });
    }

    const identifiedUser = results[0];

    // Comparing password with hash
    const valid = await bcrypt.compare(password, identifiedUser.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Create and return the token
    const token = jwt.sign(
      {
        id: identifiedUser.id,
        email: identifiedUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      id: identifiedUser.id,
      email: identifiedUser.email,
      name: identifiedUser.name,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.params.userId; // Get the user ID from the verified token

  try {
    const results = await new Promise((resolve, reject) => {
      db.all(
        "SELECT id, name, email, street, postalCode, city, admin FROM users WHERE id = ?",
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  getUserDetails,
};
