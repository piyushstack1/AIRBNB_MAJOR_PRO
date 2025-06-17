const mongoose = require("mongoose");
const reviews = require("./reviews");
const { ref } = require("joi");
const Review  = require("./reviews.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type:String,
        required : true
    },
    description: String ,




    // image: {
    //     type:String,
    //     default:"https://plus.unsplash.com/premium_photo-1748909096532-6defe679b234?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set:(v)=>v=== "" ? "https://plus.unsplash.com/premium_photo-1748909096532-6defe679b234?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v ,
    // } 



    image: {
    filename: String,
    url: String
  }
  , 
    price: Number ,
    location: String ,
    country: String ,


    reviews :[
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },

    ],
       owner:
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      
    geometry :{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});



listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;