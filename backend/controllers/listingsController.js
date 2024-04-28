const db = require("../db/database");

exports.getAllListings = (req, res) => {
  const sql = "SELECT * FROM Listings";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.getListingById = (req, res) => {
  const sql = "SELECT * FROM Listings WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  });
};

exports.getListingsByUserId = (req, res) => {
  const sql = "SELECT * FROM Listings WHERE ownerId = ?";
  db.all(sql, [req.userData.userId], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.createListing = (req, res) => {
  const { title, description, price, category } = req.body;
  const additionalInfo = req.body.additionalInfo || ""; // Handle optional additionalInfo
  const ownerId = req.userData.userId;

  const sql = `INSERT INTO Listings (title, description, price, ownerId, additionalInfo, category) VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [title, description, price, ownerId, additionalInfo, category],
    function (err) {
      if (err) {
        console.error("Error creating Listing:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Created listing ID: ", this.lastID);
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.updateListing = (req, res) => {
  const { title, description, price, additionalInfo } = req.body;
  const sql = `SELECT ownerId FROM Listings WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row.ownerId !== req.userData.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to modify this listing" });
    }
    const updateSql = `UPDATE Listings SET title = ?, description = ?, price = ?, additionalInfo = ? WHERE id = ?`;
    db.run(
      updateSql,
      [title, description, price, additionalInfo, req.params.id],
      function (err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Listing Updated", changes: this.changes });
      }
    );
  });
};

exports.deleteListing = (req, res) => {
  const sql = `SELECT ownerId FROM Listings WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row.ownerId !== req.userData.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this listing" });
    }
    const deleteSql = "DELETE FROM Listings WHERE id = ?";
    db.run(deleteSql, req.params.id, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Listing Deleted", changes: this.changes });
    });
  });
};

exports.searchListings = (req, res) => {
  let { keyword, category, priceMin, priceMax } = req.query;
  let sql = `SELECT * FROM Listings WHERE 1 = 1`;
  const params = [];

  if (keyword) {
    sql += ` AND (title LIKE ? OR description LIKE ?)`;
    keyword = `%${keyword}%`;
    params.push(keyword, keyword);
  }

  if (category) {
    sql += ` AND category = ?`;
    params.push(category);
  }

  if (priceMin) {
    sql += ` AND price >= ?`;
    params.push(priceMin);
  }

  if (priceMax) {
    sql += ` AND price <= ?`;
    params.push(priceMax);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: "Success",
      data: rows,
    });
  });
};
