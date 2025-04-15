const express=require("express");
const router=express.Router({mergeParams:true}); //parent child conflict (between the listing and reviews)
const wrapAsync=require("../utils/wrapAsync.js")
const { isLoggedin,isReviewOwner,validator} = require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

//All Reviews related routes

//review ka POST route
router.post("/",isLoggedin, validator ,
    wrapAsync(reviewController.saveReview));

//route to delete the reviews
router.delete("/:reviewId",isLoggedin,isReviewOwner,
    wrapAsync(reviewController.destroyReview));

module.exports=router;