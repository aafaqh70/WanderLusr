const Joi = require("joi");
const ExpressError = require("./Utils/ExpressError.js");

// -----------Listing Validation Schema ----------------

const ListingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
});

//-------------Review Validation Schema--------------

const ReviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

//--------------- JOI validation Middleware--------------//

const validation = (Schema) => {
  return (req, res, next) => {
    let { error } = Schema.validate(req.body);
    if (error) {
      let errorMessage = error.details.map((errdetail) => errdetail.message);
      throw new ExpressError(400, errorMessage);
    } else {
      next();
    }
  };
};

module.exports = { ListingSchema, ReviewSchema, validation };
