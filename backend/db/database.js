const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const db = new sqlite3.Database(
  "./db/marketplace.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.error("Error opening database", err.message);
    }
    console.log("Connected to the marketplace database.");
  }
);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(15),
    password_hash VARCHAR(60),
    postalCode VARCHAR(10),
    city VARCHAR(30),
    googleId VARCHAR(255),
    admin BOOLEAN NOT NULL DEFAULT 0, -- 0 for false, 1 for true
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("'Users' table created successfully.");
      }
    }
  );

  // Check if the test user exists in the database
  db.get(`SELECT id FROM users WHERE id = ?`, ["1"], (err, row) => {
    if (err) {
      console.error("Error checking for existing user:", err.message);
    } else if (row) {
      console.log("Test user already exists with ID:", row.id);
    } else {
      // User does not exist, proceed with insertion
      db.run(
        `INSERT INTO users (id, name, email, phoneNumber, password_hash, postalCode, city, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "1",
          "Timo Silakka",
          "timo@gmail.com",
          "020202",
          "KovaUkkoTimo",
          "33520",
          "Tampere",
          0,
        ],
        function (err) {
          if (err) {
            console.error("Error inserting test user:", err.message);
          } else {
            console.log("Test user added successfully with ID:", this.lastID);
          }
        }
      );
    }
  });

  const adminEmail = "matias.frimodig@tuni.fi" || "frimodigmatias@gmail.com";

  db.run(
    `UPDATE users SET admin = 1 WHERE email = ?`,
    [adminEmail],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS Listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    ownerId VARCHAR(36) NOT NULL,
    image TEXT,
    additionalInfo TEXT,
    category TEXT
);`,
    (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("'Listings' table created successfully.");
      }
    }
  );
});

// Adding a few example listings
const categories = [
  "Freetime",
  "Kitchen",
  "Sports",
  "IT",
  "Gaming",
  "Pets",
  "Home",
  "Clothing",
  "Hiking",
];

const listings = JSON.parse(fs.readFileSync("db/listings.json", "utf8"));

listings.forEach((listing) => {
  const {
    title,
    description,
    price,
    ownerId,
    additionalInfo,
    category,
    image,
  } = listing;

  // SQL to check if the listing already exists
  const checkSql = `SELECT id FROM Listings WHERE title = ? AND description = ? AND ownerId = ?`;
  db.get(checkSql, [title, description, ownerId], (checkErr, row) => {
    if (checkErr) {
      return console.error(checkErr.message);
    }

    if (!row) {
      const insertSql = `INSERT INTO Listings (title, description, price, ownerId, additionalInfo, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.run(
        insertSql,
        [title, description, price, ownerId, additionalInfo, category, image],
        function (insertErr) {
          if (insertErr) {
            return console.error(insertErr.message);
          }
          console.log(`Listing with ID ${this.lastID} added successfully.`);
        }
      );
    } else {
      console.log(`Listing already exists with ID ${row.id}`);
    }
  });
});

module.exports = db;
