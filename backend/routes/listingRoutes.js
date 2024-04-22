const express = require("express");
const router = express.Router();
const listingsController = require("../controllers/listingsController");
const verifyToken = require("../middleware/verifyToken");

router.post("/listings", verifyToken, listingsController.createListing);
router.get("/listings", listingsController.getAllListings);
router.get("/listings/:id", listingsController.getListingById);
router.get(
  "/user/listings",
  verifyToken,
  listingsController.getListingsByUserId
);
router.put("/listings/:id", verifyToken, listingsController.updateListing);
router.delete("/listings/:id", verifyToken, listingsController.deleteListing);

module.exports = router;
