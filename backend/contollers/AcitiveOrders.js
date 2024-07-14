const asyncHandler = require("express-async-handler");
const  Activeorder = require("../models/ActiveOrder");

const getActiveOrders = asyncHandler(async(req, res) =>{

    try {
        const  Active =  await  Activeorder.find();
        if(!Active){
            return   res.status(404).json({error : "no active orders  found"});
        }

        res.json(Active);
        
    } catch (error) {
         return res.status(404).json({error: ' faild to find active order : '})
    }

})

const saveOrderStatus = asyncHandler(async (req, res) => {
    const { orderId , status} = req.body;
    try {
        const order = await Activeorder.findById(orderId);
        if(!order){
            return  res.status(404).json({message:'order not found   saveorderSatus request'})
        }
        order.status= status;
        await order.save();
        res.status(200).json({ message :"order status is updated successfully "})
    } catch (error) {
        return res.status(404).json(error);
    }
});


module.exports = {getActiveOrders , saveOrderStatus }
