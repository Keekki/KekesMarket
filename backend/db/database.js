const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const db = new sqlite3.Database("./db/react_diner.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the react_diner database.");
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(60) NOT NULL,
    street VARCHAR(60),
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
        console.log("Users table created successfully.");
      }
    }
  );

  const adminEmail = "matias.frimodig@tuni.fi";

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
});

module.exports = db;
