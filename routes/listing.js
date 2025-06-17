const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const {isLoggedIn ,isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");



router.route("/")
.get(wrapAsync(listingController.index ))
.post(  isLoggedIn,validateListing, upload.single("listing[image][url]"), wrapAsync(listingController.createListings));



router.get("/new" ,isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get( wrapAsync(listingController.showListings))
.put(   isLoggedIn,isOwner, upload.single("image"),validateListing,wrapAsync(listingController.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListings));



router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));





module.exports= router;