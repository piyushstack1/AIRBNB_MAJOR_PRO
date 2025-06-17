const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});


module.exports.index = async(req , res)=>{
 const alllistings= await Listing.find({});
 res.render("listings/index.ejs", {alllistings});
}


module.exports.renderNewForm = (req , res)=>{

 res.render("listings/new.ejs");
}


module.exports.showListings =async(req , res)=>{

  let {id}= req.params;
const listing = await Listing.findById(id).populate({path: "reviews",
  populate :{
    path: "author" ,
  },
}).populate("owner");
if (!listing) {
  req.flash("error", "Listing not found!");
  return res.redirect(`/listings/${id}`);
}
res.render("listings/show.ejs", { listing });

}


module.exports.createListings = async(req , res ,next)=>{

let response = await geocodingClient
.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
.send();

// console.log(response.body.features[0].geometry);



  let url = req.file.path;
  let filename = req.file.filename;

  let listing= req.body.listing;
  const newli = new Listing(listing);
  newli.owner = req.user._id;
  newli.image ={url , filename};
  newli.geometry = response.body.features[0].geometry;
  await newli.save();
  req.flash("success", "New Listing Created !!");
res.redirect(`/listings`);
}



module.exports.renderEditForm =async(req , res)=>{

  let {id}= req.params;
   const listing = await Listing.findById(id);
   if (!listing) {
  req.flash("error", "Listing not found!");
  return res.redirect(`/listings/${id}`);
}
 res.render("listings/edit.ejs", {listing});

}







module.exports.updateListings = async (req, res) => {
  const { id } = req.params;

 
  const listing = await Listing.findById(id);

  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.country = req.body.listing.country;
  listing.location = req.body.listing.location;

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url , filename};
   await listing.save();
  
  }

  await listing.save();
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
};










module.exports.deleteListings = async(req , res)=>{

  let {id}= req.params;
   await Listing.findByIdAndDelete(id);
     req.flash("success", "New Listing Deleted!!");
 res.redirect("/listings");


}