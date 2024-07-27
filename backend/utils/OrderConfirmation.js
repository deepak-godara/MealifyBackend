const NewOrders = require("../models/NewOrder");
const UserFind=require("./DataStructures").UsersFind
const Activeorders = require("../models/ActiveOrder");
const DeleteOrder=require("./DataStructures").DeleteOrder;
// const SocketJoin=require("../utils/Join")
const GetOrder=require("./DataStructures").GetOrder
const Hotel = require("../models/Hotel");
const Carts = require("../models/Cart");
const User = require("../models/client");

// ye function call kardena impor karke ;
// sendEmail({toemail:user.Email ,  Status:status, Hname:order.HotelName , Uname:user.UserName , OrderId:orderId});


function OrderConfirm(socket, io){
socket.on(
    "OrderConfirmationFromHotel",
    async ({ orderid, code, OrderData }) => {
      try {
        console.log(orderid + " higi " + code);
        const CurrentDate = new Date();
         const Order= await GetOrder(orderid)
        if (Order) {
          console.log("orderfound");
          const orderTimeDifference = Math.abs(CurrentDate - Order[1]) / 1000;
console.log(orderTimeDifference)
          if (orderTimeDifference <= 60) {
            const socketId= await UserFind(Order[0][0])
            if (socketId) {
              if (code === 0) {
                io.to(socketId).emit("Notification", {
                  Message: "Order Rejected by Hotel",
                  Id: 0,
                });
                await NewOrders.deleteOne({ OrderId: orderid });
              } else {
                io.to(socketId).emit("Notification", {
                  Message: "Order Accepted by Hotel",
                  Id:0,
                });
              }
            }

            if (code !== 0) {
            //   delete OrderData._id;
              const ActOrder = {
                ...OrderData,
                OrderStatus: "Accepted",
                HotelDeliveryConfirmation:false,
                UserDeliveryConfirmation:false,
                OwnerId: Order[0][1],
                DeliveryId : Math.floor(Math.random()*100000000)
              };

              const NewActiveOrder = new Activeorders(ActOrder);
              try {
                const savedOrder = await NewActiveOrder.save();
                OrderIds = savedOrder._id;

                const user = await User.findById(OrderData.UserId);
                console.log("emptying the cart");
                const cart = await Carts.findOne({ UserId: user._id });
                if (cart) {
                  cart.HotelId = null;
                  cart.HotelName = null;
                  cart.Items = [];
                  cart.SubTotal = 0;
                  cart.GST = 0;
                  cart.Delivery = 0;
                  cart.Total = 0;
                  cart.Quantity = 0;
                  await cart.save();
                }

                // ActiveOrders.set(orderid, OrderData);
                await DeleteOrder(orderid);
                await NewOrders.deleteOne({ OrderId: orderid });
              } catch (err) {
                console.error(err);
              }
            }
          }
        } else {  
          console.log("Order received late");
          await DeleteOrder(orderid);
          await NewOrders.deleteOne({ OrderId: orderid });
        }
      } catch (err) {
        console.error("Error processing order confirmation from hotel:", err);
      }
    }
  );
}
module.exports={
    OrderConfirm:OrderConfirm
}