const mongoose = require("mongoose");
const Reviews = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description: String,
    image:{
        url:String,
        filename:String,
        },
        price: Number,
        location: String,
        country: String,
        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"Review"
            }
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
);

//middleware to delete the reviews associated with the listing when listing gets deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id : {$in : listing.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;