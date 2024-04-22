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
  const { title, description, price, additionalInfo } = req.body;
  const ownerId = req.userData.userId;
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
