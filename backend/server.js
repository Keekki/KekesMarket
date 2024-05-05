const express = require("express");
const path = require("path");
const cors = require("cors");
const app = require("./app");

require("dotenv").config();

// Start the server only if not in the test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

app.use(cors());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../build")));

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});
