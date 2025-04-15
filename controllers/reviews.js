const Listing = require("../models/listings.js");
const Review=require("../models/reviews.js");

module.exports.saveReview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let review=new Review(req.body);
    review.author=req.user._id;
    console.log(review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Review Saved!!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async(req,res)=>{
    console.log("Delete Route invoked");
    let{id , reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
};