// let ActiveOwners = new Map();
// let ActiveUsers = new Map();
// let ActiveOrders = new Map();
// let NewOrder = new Map();
// let OwnerOrderMap = new Map();
let OrderCount = 0;
const Hotel = require("../models/Hotel");
const Carts = require("../models/Cart");
const User = require("../models/client");
const NewOrders = require("../models/NewOrder");
// const OrderConfirmation=require("./")
const Activeorders = require("../models/ActiveOrder");
// const SocketJoin=require("../utils/Join")
function CheckNewOrderValidity() {
  NewOrder = NewOrder.filter((item) => {
    if ((item[3] - new Date()) / 1000 > 120) {
    }
  });
}
function SocketsFunctions(socket, io) {

  socket.on("statusUpdateMessage", ({ status, ownerId, userId, orderId }) => {
    const activeUserId = ActiveUsers.get(userId.toString());
    console.log("Status change from user side is:", activeUserId);
    if (activeUserId) {
      io.to(activeUserId).emit("changeStatusUserside", {
        status,
        ownerId,
        userId,
        orderId,
      });
      console.log("Status change has been sent by owner to user.");
    } else {
      console.error(`User with ID ${userId} not found in ActiveUsers.`);
    }
  });

  socket.on(
    "deliveryConfirmationByiUser",
    async ({ orderId, ownerId, useId, status }) => {
      console.log("ownerId  ", ownerId);
      const Ownerid = ActiveOwners.get(ownerId);
      if (Ownerid) {
        io.to(Ownerid).emit("DeliveryConfirmed", {
          orderId: orderId,
          status: status,
        });
        console.log("Order delivery  Conformed by  user");
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
