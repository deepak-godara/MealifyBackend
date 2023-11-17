const express=require('express');
const path=require('path');
const addCartController=require('../contollers/ClientCart')
const router=express.Router();
// router.post('/client/login',addClientController.getLogined);
router.post('/:client',addCartController.addToCart);
router.get('/:client/getcart',addCartController.getCart);
module.exports=router;