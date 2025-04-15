const Listing = require("../models/listings.js");

module.exports.index= async (req, res) => {
    let totalList = await Listing.find({}); // Fetch all listings
    res.render("./listings/index.ejs", { totalList }); // Render the index page with listings
};

module.exports.newListForm=(req, res) => {
    res.render("listings/new.ejs"); // Render the 'new listing' form
};

module.exports.saveNewList=async (req, res, next) => { 
    console.log(req.body);
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,",,,,,",filename);

    let list = new Listing(req.body);
    list.owner=req.user._id;
    list.image={url,filename};
    await list.save();
    
    req.flash("success","New Listing Added!!");
    res.redirect("/listings");
};

module.exports.showListing=async (req, res) => {
    let id = req.params.id; // Get the listing ID from the URL
    let list = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");// Find the listing in the database
    if(!list){
        req.flash("failure","The Listing Doesn't Exist");
        res.redirect("/listings");
    } 
    res.render("./listings/show.ejs", { list }); // Render the show page for the listing
};

module.exports.editListingForm=async (req,res)=>{
    let id=req.params.id;
    let list=await Listing.findById(id);
    if(!list){
        req.flash("failure","The Listing Doesn't Exist");
        res.redirect("/listings");
    } 
    let imageUrl=list.image.url;
    res.render("./listings/edit.ejs",{list,imageUrl})
};

module.exports.saveEditedListing=async (req, res) => {
    const { id } = req.params;
    let list=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename; 
        list.image={url,filename};
        await list.save();
    }
    req.flash("success","Listing Edited Successfully!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)
        .then(() => {
            req.flash("success","Listing Edited Successfully!!");
            res.redirect("/listings");
        })
        .catch(err => {
            console.error("Error updating listing:", err);
            res.send("Failed to update listing.");
        });
};