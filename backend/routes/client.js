const express=require('express');
const path=require('path');
const addClientController=require('../contollers/clientLogin')
const ClientOperationController=require('../contollers/ClientOperation')
const {getAddress, deleteAddress,SetDefaultAddress}  = require("../contollers/address");
const { getActiveOrders, saveOrderStatus } = require('../contollers/AcitiveOrders');
const router=express.Router();
router.post('/client/login',addClientController.getLogined);
router.post('/client/signup',addClientController.postLogin);
router.post('/:clientid/addaddress',ClientOperationController.AddAddress)
router.post('/:clientid/foreimage',ClientOperationController.AddForeImage)
router.post('/:clientid/backimage',ClientOperationController.AddBackImage)
router.get("/:clientid/data",ClientOperationController.ClientData)
router.post("/:clientid/updateprofile",ClientOperationController.UpdateProfile)
router.get("/:orderid/getorderdetails",ClientOperationController.Getorderdetails)
router.route("/:Cid/address").get(getAddress);
router.route("/:Cid/:Aid/address/delete").get(deleteAddress)
router.post("/:Cid/updatecurrentaddress",SetDefaultAddress)
router.route("/owner/ActiveOrders").get(getActiveOrders);
router.route('/owner/ActiveOrders/statusUpdate').put(saveOrderStatus)
module.exports=router