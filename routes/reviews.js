const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {  reviewSchema } = require("../schema.js");
// const Review = require('../models/reviews');
// const Listing = require('../models/listing');
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");

const listingsReview = require("../controllers/reviews.js");



router.delete("/:reviewId" ,isLoggedIn , isReviewAuthor, wrapAsync(listingsReview.destroyReview))


router.post("/" ,isLoggedIn, validateReview,wrapAsync(listingsReview.createReview ));



module.exports = router;     



