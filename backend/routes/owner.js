const express=require('express');
const path=require('path');
const addhotelController=require('../contollers/OwnerHotel')
const addOwnerController=require('../contollers/ownerLogin')
const router=express.Router();
router.post('/owner/login',addOwnerController.getLogined);
router.post('/owner/signup',addOwnerController.postLogin);
router.get('/owner/:id/gethotel',addhotelController.OwnergetHotel);
router.post('/owner/:id/addhotel', addhotelController.OwnerAddHotel);
router.get('/owner/:id/:hotelid',addhotelController.getOwnerHotel)
module.exports=router;