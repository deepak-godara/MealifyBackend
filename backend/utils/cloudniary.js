require('dotenv').config();
const cloudinary=require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dr07jtila', 
    api_key: '431155277566838', 
    api_secret: 'KegFso7xvvMszoP_hFeZ_s6JItI',
})
module.exports={cloudinary}