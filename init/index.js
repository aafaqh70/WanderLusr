const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const sampleListings = require("./data.js");

main()
  .then(() => {
    console.log("connected Successfuly");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const initData = async () => {
  await Listing.deleteMany({});

  const newsampleListings = sampleListings.map((listing) => ({
    ...listing,
    owner: "66ab55d9dab5226755054eae",
  }));
  await Listing.insertMany(newsampleListings);
  console.log("data initialized successfuly");
};

initData();
