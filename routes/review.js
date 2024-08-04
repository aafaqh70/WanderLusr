const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const WrapAsync = require("../Utils/WrapAsync.js");
const { ReviewSchema, validation } = require("../validationSchema.js");
const { isLogeIn, isValidReviewAuther } = require("../Utils/Middleware.js");
const reviewController = require("../controller/review.js");

// ----------------------------------------Review APIs----------------------------------------------------

// -----------Create Review -----------
router.post(
  "/",
  isLogeIn,
  validation(ReviewSchema),
  WrapAsync(reviewController.createReview)
);

// -----------Delete Review-----------
router.delete(
  "/:reviewId",
  isLogeIn,
  isValidReviewAuther,
  WrapAsync(reviewController.deleteReview)
);

module.exports = router;
