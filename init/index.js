const mongoose = require("mongoose");
const Listing = require('../models/listing');

const initdata = require("./data.js");


main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data =initdata.data.map((obj)=>({
...obj , owner: '684e5e8cd218d6bc3182a9eb'
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
}
initDB();