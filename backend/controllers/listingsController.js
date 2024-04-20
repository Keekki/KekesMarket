const db = require("../db/database");

exports.createListing = (req, res) => {
  const { title, description, price, ownerId, additionalInfo } = req.body;
  const sql = `INSERT INTO Listings (title, description, price, ownerId, additionalInfo) VALUES (?, ?, ?, ?, ?)`;
  db.run(
    sql,
    [title, description, price, ownerId, additionalInfo],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.getAllListings = (req, res) => {
  const sql = "SELECT * FROM Listings";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.updateListing = (req, res) => {
  const { title, description, price, additionalInfo } = req.body;
  const sql = `UPDATE Listings SET title = ?, description = ?, price = ?, additionalInfo = ? WHERE id = ?`;
  db.run(
    sql,
    [title, description, price, additionalInfo, req.params.id],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Listing Updated", changes: this.changes });
    }
  );
};

exports.deleteListing = (req, res) => {
  const sql = "DELETE FROM Listings WHERE id = ?";
  db.run(sql, req.params.id, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "Listing Deleted", changes: this.changes });
  });
};
