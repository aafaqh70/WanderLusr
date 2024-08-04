const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync.js");
const { ListingSchema, validation } = require("../validationSchema.js");
const { isLogeIn, isValidListingOwner } = require("../Utils/Middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ----------------------------------------Listing APIs----------------------------------------------------

router
  .route("/")
  .get(WrapAsync(listingController.index))
  .post(
    isLogeIn,
    upload.single("listing[image]"),
    validation(ListingSchema),
    WrapAsync(listingController.createLListing)
  );

router
  .route("/:id")
  .get(WrapAsync(listingController.showListing))
  .put(
    isLogeIn,
    isValidListingOwner,
    upload.single("listing[image]"),
    validation(ListingSchema),
    WrapAsync(listingController.updateListing)
  )
  .delete(
    isLogeIn,
    isValidListingOwner,
    WrapAsync(listingController.deleteListing)
  );

router.get("/new/listing", isLogeIn, listingController.renderNewForm);

router.get("/edit/:id", isLogeIn, WrapAsync(listingController.renderEditForm));

module.exports = router;
