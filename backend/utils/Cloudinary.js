const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});

module.exports = cloudinary;
