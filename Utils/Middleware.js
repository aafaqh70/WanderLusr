const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.isLogeIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must need to login first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.SaveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isValidListingOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You Don't have permissions to do this");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isValidReviewAuther = async (req, res, next) => {
  let { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review.auther.equals(req.user._id)) {
    req.flash("error", "You don't have permision for this");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
