const express=require('express');
const path=require('path');
const addClientController=require('../contollers/clientLogin')
const ClientOperationController=require('../contollers/ClientOperation')
const router=express.Router();
router.post('/client/login',addClientController.getLogined);
router.post('/client/signup',addClientController.postLogin);
router.post('/:clientid/addaddress',ClientOperationController.AddAddress)
router.post('/:clientid/foreimage',ClientOperationController.AddForeImage)
router.post('/:clientid/backimage',ClientOperationController.AddBackImage)
router.get("/:clientid/data",ClientOperationController.ClientData)
router.post("/:clientid/updateprofile",ClientOperationController.UpdateProfile)
module.exports=router