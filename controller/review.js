const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  let { id } = req.params;
  let feedback = req.body.review;
  const newReview = new Review(feedback);
  const listing = await Listing.findById(id);
  newReview.auther = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review Created Successfuly");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfuly");
  res.redirect(`/listings/${id}`);
};
