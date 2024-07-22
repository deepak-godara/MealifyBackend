const Hotel = require("../models/Hotel");
const Carts = require("../models/Cart");
const User = require("../models/client");
const Activeorders = require("../models/ActiveOrder");
const { OwnerFind, UsersFind } = require("./DataStructures");
function SocketsFunctions(socket, io) {

  socket.on("statusUpdateMessage", async ({ status, ownerId, userId, orderId }) => {
    const activeUserId = String(UsersFind(userId));
  
    try {
      console.log("Status change from user side is:", activeUserId);
      if (activeUserId) {
        try {
          const order = await Activeorders.findById(orderId);
          if (!order) {
            console.log("Order not found in active orders in socket.js");
          } else {
            await order.addStatus(status);
            order.OrderStatus = status;
            await order.save();
          }
        } catch (error) {
          console.error("Error finding active order or updating status:", error);
        }
  
        io.to(activeUserId).emit("changeStatusUserside", {
          status,
          ownerId,
          userId,
          orderId,
        },async (acknowledgment)=>{
          if(acknowledgment===true)
          {
            console.log("Status change has been sent by owner to user.");
          }
          else
          console.log("Status change has been recived by user")
        })
      } else {
        console.error(`User with ID ${userId} not found in ActiveUsers.`);
      }
    } catch (outerError) {
      console.error("Error in statusUpdateMessage handler:", outerError);
    }
  });
  

  socket.on(
    "deliveryConfirmationByUser",
    async ({ orderId, ownerId, userId, status }) => {
      console.log("ownerId  ", ownerId);
      const Ownerid = OwnerFind(ownerId.toString())
      console.log(" wertyuiopoiujhgfdghjk")
      try {
        if (Ownerid) {
          try {
            const order = await Activeorders.findById(orderId);
            if (!order) {
              console.log("Order not found in active orders in socket.js");
            } else {
              await order.addStatus(status);
              order.OrderStatus = status;
              await order.save();
              console.log("Order delivered");
            }
          } catch (error) {
            console.error("Error finding active order or updating status:", error);
          }
  
          io.to(Ownerid).emit("DeliveryConfirmed", {
            orderId: orderId,
            status: status,
          });
          console.log("Order delivery confirmed by user");
        } else {
          console.error(`Owner with ID ${ownerId} not found in ActiveOwners.`);
        }
      } catch (Error) {
        console.error("Error in deliveryConfirmationByUser handler:", Error);
      }
    }
  );
  
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
