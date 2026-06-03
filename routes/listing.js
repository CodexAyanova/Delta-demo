const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require(`multer`);
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))  //index route
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListings)
);

    
//new route
router.get("/new", isLoggedIn, listingController.renderNewForms);


router.get("/filter/:category", wrapAsync(listingController.filterByCategory));

router.get("/search", wrapAsync(listingController.searchListings));


router.route("/:id")
.get( wrapAsync(listingController.showListings))       //show route
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))   //update route
.delete(isLoggedIn,isOwner,  wrapAsync(listingController.destroyListing));               //delete route


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;