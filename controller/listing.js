const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
  const listings = await Listing.find();

  res.render("listing/allListings.ejs", { listings });
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;

  const listingdetail = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "auther" } })
    .populate("owner");
  if (!listingdetail) {
    req.flash("error", "Listing your are searching for is not available!");
  }
  res.render("listing/listingDetail.ejs", { listingdetail });
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("listing/newListing.ejs");
};

module.exports.createLListing = async (req, res, next) => {
  const response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const url = req.file.path;
  const filename = req.file.filename;
  if (!req.body.listing) {
    next(new ExpressError(400, "Data is not valid please send correct data"));
  }
  let newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  await newlisting.save();
  req.flash("success", "Listing Created Successfuly!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;

  const listingdetail = await Listing.findById(id);

  const originalImageUrl = listingdetail.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  if (!listingdetail) {
    req.flash("error", "Listing your are searching for is not available!");
  }
  res.render("listing/editForm.ejs", { listingdetail });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated Successfuly!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfuly!");
  res.redirect(`/listings`);
};
