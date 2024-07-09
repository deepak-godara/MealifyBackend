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

module.exports = {getActiveOrders}
