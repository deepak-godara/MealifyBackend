const express=require('express');
const path=require('path');
const addHotelcontollers=require('../contollers/Hotel')
const addLocationController=require('../contollers/Location')
const AddHotelDetailcontrollers=require('../contollers/HotelDetail');
const router=express.Router();
// cons
router.get('/gethomepage',addLocationController.getAllLocation);
// router.get('/gethotels/',addLocationController.getHotelForLocationName);
router.post('/gethotels/:locationname',addLocationController.getLocationForCoordinates);
router.post('/gethotel/getdishes',addLocationController.getDishes)
router.get('/gethotels/:locationame')
module.exports=router;