const asyncHandler = require("express-async-handler");
const  Activeorder = require("../models/ActiveOrder");

const getOwnerActiveOrders = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const Active = await Activeorder.find({ HotelId: id });
        if (Active.length === 0) {
            return res.status(404).json({ error: "No active orders found" });
        }

        res.json(Active);
        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to find active orders: ' + error.message });
    }
});

const getUserActiveOrders = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const Active = await Activeorder.find({ UserId: id });
        if (Active.length === 0) {
            return res.status(404).json({ error: "No active orders found" });
        }

        res.json(Active);
        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to find active orders: ' + error.message });
    }
});



const saveOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
    try {
        const order = await Activeorder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found in saveOrderStatus request' });
        }
        if (status === 'deliveryConfirmByUser') {
            order.UserDeliveryConfirmation = true;
        } else {
            order.OrderStatus = status; 
        }
        await order.save(); 
        res.status(200).json({ message: 'Order status is updated successfully', order });
    } catch (error) {
        return res.status(500).json({ message: error.message }); 
    }
});


module.exports = {getOwnerActiveOrders, getUserActiveOrders , saveOrderStatus }
