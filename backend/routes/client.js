const express=require('express');
const path=require('path');
const addClientController=require('../contollers/clientLogin')
const router=express.Router();
router.post('/client/login',addClientController.getLogined);
router.post('/client/signup',addClientController.postLogin);
module.exports=router;