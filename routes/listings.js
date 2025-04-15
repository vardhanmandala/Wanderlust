const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const { isLoggedin,isOwner,validation} = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
//All the listings related routes

// Route to display all listings
router.get("/", wrapAsync(listingController.index));

// Route to render the form for adding a new listing
router.get("/new",isLoggedin,
    listingController.newListForm);

//newList
router.post("/",isLoggedin,upload.single('image'),
    wrapAsync(listingController.saveNewList));

// Route to display a single listing by its ID
router.get("/:id", listingController.showListing);

//edit route
router.get("/:id/edit",isLoggedin,isOwner,
    listingController.editListingForm)

// Update a listing in the database
router.put("/:id/update",isLoggedin,isOwner,upload.single('image'), validation,
    wrapAsync(listingController.saveEditedListing));

//delete route
router.delete("/:id",isLoggedin,isOwner,
    listingController.destroyListing);

module.exports=router;