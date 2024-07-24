const Hotel = require("../models/Hotel");
const Carts = require("../models/Cart");
const User = require("../models/client");
const Activeorders = require("../models/ActiveOrder");
const{sendEmail} = require('./SendMail')
// const Hotel  = require('../models/Hotel')
const { OwnerFind, UsersFind } = require("./DataStructures");
function SocketsFunctions(socket, io) {

  socket.on("statusUpdateMessage", async ({ status, ownerId, userId, orderId }) => {
    const activeUserId =  await  UsersFind(userId.toString());
    console.log("Received statusUpdateMessage event for userId:", userId);
    console.log("activeUserId:", activeUserId);
  
    try {
      const order = await Activeorders.findById(orderId);
      const user = await User.findById(userId);
      if (activeUserId) {
        try {
          if (!order || !user) {
            console.log("Order not found in active orders in socket.js");
          } else {
            await order.addStatus(status);
            order.OrderStatus = status;
            await order.save();
            sendEmail({toemail:user.Email ,  Status:status, Hname:order.HotelName , Uname:user.UserName , OrderId:orderId});
            console.log("Order status updated successfully and Email");
          }

        } catch (error) {
          console.error("Error finding active order or updating status:", error);
        }
  
        console.log("changeStatusUserside event to activeUserId:", activeUserId);
        io.to(activeUserId).emit("changeStatusUserside", {
          status,
          ownerId,
          userId,
          orderId,
          Name:order.HotelName,
        });
        console.log("Status change has been sent by owner to user.");
      } else {
        console.error(`User with ID ${userId} not found in ActiveUsers.`);
      }
    } catch (outerError) {
      console.error("Error in statusUpdateMessage handler or in finding user :", outerError);
    }
  });
  
  

  socket.on(
    "deliveryConfirmationByUser",
    async ({ orderId, HotelId, userId, status }) => {
      console.log("ownerId  ", HotelId);
      
      // try {
        // const Ownerid = await OwnerFind(ownerId.toString());
        // console.log("Ownerid: ", Ownerid);
        // if (Ownerid) {
          try {
            const order = await Activeorders.findById(orderId);
            const hotel =  await Hotel.findById(HotelId);
            const client =  await User.findById(userId);
            console.log("ewrtybunijmk" , userId)
            console.log("ewrtybunijmk" , client._id)
            if (!order || !hotel || !client) {
              console.log("hotel or client || Order not found in active orders in socket.js");
            } else {
              const Ownerid = await OwnerFind(hotel.Id);
              const  UserId = await UsersFind(userId);
              console.log("Ownerid: ", Ownerid);
              console.log("userId: ", UserId);
              if (Ownerid && UserId) {
              if (order.UserDeliveryConfirmation && order.HotelDeliveryConfirmation) {
                await order.addStatus(status);
                order.OrderStatus = status;
                await order.save();
                sendEmail({toemail:client.Email ,  Status:status, Hname:order.HotelName , Uname:client.UserName , OrderId:orderId});
                console.log("Order delivered");       
                io.to(String(Ownerid)).emit("DeliveryConfirmed", {
                  orderId: orderId,
                  status: status,
                  Name :client.UserName,
                });
                io.to(String(UserId)).emit("DeliveryConfirmed", {
                  orderId: orderId,
                  status: status,
                  HotelName :hotel.Name,
                });
                console.log("Order delivery confirmed by user");
              }
            }
            }
          } catch (error) {
            console.error("Error finding active order or updating status:", error);
          }
        // } else {
        //   console.error(`Owner with ID ${ownerId} not found in ActiveOwners.`);
        // }
      // } catch (error) {
      //   console.error("Error in deliveryConfirmationByUser handler:", error);
      // }
    }
  );
  
  
  socket.on("requestForDeliveryConformationbyOwner", async ({ UserId, OwnerId, OrderId }) => {
    try {
      const userId = await UsersFind(UserId);
      const ownerId = await OwnerFind(OwnerId);  
      if (!userId) {
        console.log("User not found");
        return;
      }
      console.log("User ID from requestForDeliveryConfirmationByOwner is: ", userId);
      const order = await Activeorders.findById(OrderId);
      if (!order) {
        console.log("Order not found");
        return;
      }
      order.HotelDeliveryConfirmation = true;
      await order.save();
      io.emit('deliveryConfirmationRequestOwner', { UserId: UserId, OwnerId: OwnerId, OrderId: OrderId });
      io.to(userId).emit('deliveryConfirmationRequestOwner', { UserId: UserId, OwnerId: OwnerId, OrderId: OrderId });
      console.log("Confirmation sent by owner to user for delivery");
    } catch (error) {
      console.log("Error occurred in finding active user or processing order: ", error);
    }
  });
  

  async function NewOrderFilter(id, map) {
    return new Map([...map].filter(([key, value]) => key != id));
  }
  async function filters(id, map) {
    return new Map([...map].filter(([key, value]) => key != id));
  }
  socket.on("DeliveryConfirmationByUser", (OrderId) => {});
  socket.on("disconnec", async (message, User) => {
    console.log("disconnect");
    if (User === "User") ActiveUsers = await filters(message.id, ActiveUsers);
    else {
      ActiveOwners = await filters(message.id, ActiveOwners);
    }
    socket.disconnect();
  });
}

module.exports = {
  SocketFunction: SocketsFunctions,
};
