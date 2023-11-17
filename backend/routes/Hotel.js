const express=require('express');
const path=require('path');
const addHotelcontollers=require('../contollers/Hotel')
const AddHotelDetailcontrollers=require('../contollers/HotelDetail');
const router=express.Router();
console.log('hifdfsdfi');
router.post('/hotels/add',addHotelcontollers.getHotel);
router.get('/hotels/add',addHotelcontollers.postHotel);
router.post('/:hotelid/adddish',AddHotelDetailcontrollers.postHotelDish);
router.get('/:hotelid/getdata',AddHotelDetailcontrollers.getHotelData);
router.post('/:hotelid/addcategory',AddHotelDetailcontrollers.addFoodCategory);
router.post('/:hotelid/deleteitem',AddHotelDetailcontrollers.deleteFoodItem);
module.exports=router;