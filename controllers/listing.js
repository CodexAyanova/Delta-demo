const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
    };

module.exports.renderNewForms = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
    },
    }).populate("owner");
    if(!listing){
        req.flash("error", "This listing does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing}); 
    console.log(listing);
};

module.exports.createListings = async (req, res) => {
    let url = req.file.path;
    let filename =  req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "This listing does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename =  req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({ category });
    if(allListings.length === 0){
        req.flash("error", "No listings found for this category!");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
};

module.exports.searchListings = async (req, res) => {
    const { q } = req.query;
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
        ]
    });
    if(allListings.length === 0){
        req.flash("error", "No listings found!");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", { allListings });
};