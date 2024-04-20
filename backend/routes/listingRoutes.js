const express = require("express");
const router = express.Router();
const listingsController = require("../controllers/listingsController");

router.post("/listings", listingsController.createListing);
router.get("/listings", listingsController.getAllListings);
router.put("/listings/:id", listingsController.updateListing);
router.delete("/listings/:id", listingsController.deleteListing);

module.exports = router;
