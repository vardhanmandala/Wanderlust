const Listing = require("./models/listings.js");
const {listingsSchema}=require("./schema.js");
const Reviews=require("./models/reviews.js");
const ExpressError=require("./utils/ExpressError.js");
const {reviewsSchema}=require("./schema.js");

//to check authenticated or not
module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Save the URL before redirecting
        req.flash("failure", "Please do login!");
        return res.redirect("/login");
    }
    next();
};
//to save the redirectUrl
module.exports.saveUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl || "/listings"; 
    next();
};

//listing owner autherization
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("failure","You're Unautherized");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//review owner autherization
module.exports.isReviewOwner = async (req, res, next) => {
    let {id,reviewId} = req.params;
    console.log(id);
    console.log(req.params);
    let review = await Reviews.findById(reviewId).populate("author"); // Ensure author is populated
    
    // console.log(review);
    // Check if the review exists and if the current user is the author
    if (!review) {
        req.flash("failure", "Review not found");
        return res.redirect("/listings");
    }

    if (review.author && !review.author._id.equals(res.locals.curUser._id)) {
        req.flash("failure", "You're Unauthorized");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
};



//middleware for the schemacvalidation of listings
module.exports.validation = (req, res, next) => {
    console.log(req.body);
    let { error } = listingsSchema.validate({listing:req.body});
    if (error) {
        console.log("Validation Error:", error.details[0].message);
        throw new ExpressError(400, error.details[0].message);
    } else {
        //console.log("No validation error");
        next(error);
    }
};

//middleware to vlidate the reviewSchema
module.exports.validator = (req, res, next) => {
    console.log(req.body);
    let { error } = reviewsSchema.validate({review:req.body});
    if (error) {
        console.log("Validation Error:", error.details[0].message);
        throw new ExpressError(400, error.details[0].message);
    } else {
        console.log("No validation error");
        next(error);
    }
};