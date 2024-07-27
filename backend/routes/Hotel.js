const express=require('express');
const path=require('path');
const addHotelcontollers=require('../contollers/Hotel')
const Reviewcontroller=require("../contollers/Review")
const AddHotelDetailcontrollers=require('../contollers/HotelDetail');
const {GetOwnerReview , AddReview , getUserReviews}  = require('../contollers/Review');
const router=express.Router();
console.log('hifdfsdfi');
router.post('/hotels/add',addHotelcontollers.getHotel);
router.get('/hotels/add',addHotelcontollers.postHotel);
router.post('/:hotelid/adddish',AddHotelDetailcontrollers.postHotelDish);
router.get('/:hotelid/getdata',AddHotelDetailcontrollers.getHotelData);
router.post('/:hotelid/addcategory',AddHotelDetailcontrollers.AddMenuCategory);
router.post('/:hotelid/deleteitem',AddHotelDetailcontrollers.deleteFoodItem);
router.get('/:hotelid/getmenu',AddHotelDetailcontrollers.getMenu);
router.get('/:hotelid/getdistance',addHotelcontollers.getDistances)
router.get('/:hotelid/getneworder',addHotelcontollers.getNewOrders);
router.route("/review/add").post(AddReview)
router.route('/:id/owner/review').get(GetOwnerReview)
router.route('/:id/user/review').get(getUserReviews)

module.exports=router;    