const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD,
    api_key: process.env.CLOUD_API,
    api_secret:process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedformat: ["png","jpg","jpeg"],
   
  },
});


module.exports={
    cloudinary,storage
};