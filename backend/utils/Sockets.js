let ActiveOwners = new Map();
let ActiveUsers = new Map();
let ActiveOrders = new Map();
let NewOrder = new Map();
let OwnerOrderMap = new Map();
let OrderCount = 0;
const Hotel = require("../models/Hotel");
const Carts = require("../models/Cart");
const User = require("../models/client");
const NewOrders = require("../models/NewOrder");
const Activeorders = require("../models/ActiveOrder");
function CheckNewOrderValidity() {
  NewOrder = NewOrder.filter((item) => {
    if ((item[3] - new Date()) / 1000 > 120) {
    }
  });
}
function SocketsFunctions(socket, io) {
  // console.log(scokets);
  socket.on("join", async (message) => {
    console.log("yes")
    try {
      // console.log(message);
      if (message.User === "User") {
        ActiveUsers = await filters(message.id, ActiveUsers);
        const UserId = message.id;
        const Socketid = socket.id;
        let pair = [socket.id, message.id];
        ActiveUsers.set(UserId, Socketid);
      } else {
        var newsockets = await filters(message.id, ActiveOwners);
        ActiveOwners = newsockets;
        let pair = [socket.id, message.id];
        const UserId = message.id;
        const Socketid = socket.id;
        // console.log(pair);
        ActiveOwners.set(UserId, Socketid);
       
      }
      console.log(ActiveOwners);
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("message", ({ Cart }) => {
    console.log(Cart);
    // console.log(socket.id)
  });
  socket.on("NewOrder", async ({ id, Cart, UserId }) => {
    try {
      const hotel = await Hotel.findOne({ _id: id });
      if (!hotel) {
        socket.emit("OrderConfirmation", {
          message: "Hotel not found",
          code: 404,
        });
        return;
      }
  
      if (ActiveOwners.has(hotel.Id.toString())) {
        const ids = ActiveOwners.get(hotel.Id.toString());
        const CurrentDate = new Date();
        const formattedDate = CurrentDate.toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
  
        OrderCount += 1;  // Increment the order count
        console.log(OrderCount);
  
        const Order = new NewOrders({
          HotelName: Cart.HotelName,
          UserId: UserId,
          OrderId: `${formattedDate}${OrderCount}`,
          HotelAddress: hotel.City,
          HotelId: Cart.HotelId,
          OwnerId: hotel.Id,
          Items: Cart.Items.map((item) => {
            return {
              ...item,
              Total: +item.Price * +item.Quantity,
            };
          }),
          ItemTotal: Cart.BillDetails.SubTotal,
          GST: Cart.BillDetails.GST,
          Delivery: Cart.BillDetails.Delivery,
          Total: Cart.BillDetails.Total,
          OrderDetails: {
            Date: CurrentDate.toString(),
            Payment: "Cash On Delivery",
            DeliverTo: "Delivery Address",
            PhoneNo: 123456778,
          },
        });
  
       
  
        io.to(ids).emit(
          "NewOrderReceived",
          {
            message: "new order",
            OrderId: Order.OrderId,
            Order: Order,
            Total: Order.Total,
            UserId: Order.UserId,
          },
          async (acknowledgment) => {
            if (acknowledgment) {
              await Order.save();
              const pairs = [[Order.UserId, Order.HotelId], CurrentDate];
              NewOrder.set(Order.OrderId, pairs);
              console.log("added new order");
            } else {
              await NewOrders.findOneAndDelete({ OrderId: Order.OrderId });
              socket.emit("OrderConfirmation", {
                message:
                  "Can't place your order as hotel has turned off new orders",
                code: 201,
              });
            }
          }
        );
      } else {
        socket.emit("OrderConfirmation", {
          message: "Can't place your order as hotel has turned off new orders",
          code: 201,
        });
      }
    } catch (err) {
      console.error(err);
      socket.emit("OrderConfirmation", {
        message: "An error occurred while placing your order",
        code: 500,
      });
    }
  });

  socket.on("OrderConfirmationFromHotel", async ({ orderid, code, OrderData }) => {
    try {
      console.log(orderid + " higi " + code);
      const CurrentDate = new Date();
  
      if (NewOrder.has(orderid)) {
        console.log("orderfound")
        const Order = NewOrder.get(orderid);
        const orderTimeDifference = Math.abs(CurrentDate - Order[1]) / 1000;
  
        if (orderTimeDifference <= 60) {
          if (ActiveUsers.has(Order[0][0].toString())) {
            const socketId = ActiveUsers.get(Order[0][0].toString());
  
            if (code === 0) {
              io.to(socketId).emit("OrderConfirmationByHotel", {
                message: "Order Rejected by Hotel",
                code: "202",
              });
              await NewOrders.deleteOne({ OrderId: orderid });
            } else {
              io.to(socketId).emit("OrderConfirmationByHotel", {
                message: "Order Accepted by Hotel",
                code: "200",
              });
            }
          }
  
          if (code !== 0) {
            delete OrderData._id;
            const ActOrder = {
              ...OrderData,
              OrderStatus: "Accepted",
              OwnerId: Order[0][1],
            };
  
            const NewActiveOrder = new Activeorders(ActOrder);
            let OrderIds;
  
            try {
              const savedOrder = await NewActiveOrder.save();
              OrderIds = savedOrder._id;
  
              const user = await User.findById(OrderData.UserId);
              // console.log(user);
              user.AddOrder(OrderIds);
     console.log("emptying the cart")
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
  
              ActiveOrders.set(orderid, OrderData);
              NewOrder = await NewOrderFilter(orderid, NewOrder);
              await NewOrders.deleteOne({ OrderId: orderid });
            } catch (err) {
              console.error(err);
            }
          }
        }
      } else {
        console.log("Order received late");
        NewOrder = await NewOrderFilter(orderid, NewOrder);
        await NewOrders.deleteOne({ OrderId: orderid });
      }
    } catch (err) {
      console.error("Error processing order confirmation from hotel:", err);
    }
  });
  
  socket.on("statusUpdateMessage",({ status, ownerId, userId, orderId }) => {
    const activeUserId = ActiveUsers.get(userId.toString());
    console.log("Status change from user side is:", activeUserId);
    if (activeUserId) {
      io.to(activeUserId).emit("changeStatusUserside", { status, ownerId, userId, orderId });
      console.log("Status change has been sent by owner to user.");
    } else {
      console.error(`User with ID ${userId} not found in ActiveUsers.`);
    }
  });
  

socket.on("deliveryConfirmationByiUser" , async({orderId, ownerId, useId, status})=>{
  console.log("ownerId  " , ownerId)
  const  Ownerid =  ActiveOwners.get(ownerId);
  if(Ownerid){
    io.to(Ownerid).emit("DeliveryConfirmed" ,{orderId:orderId , status:status});
    console.log("Order delivery  Conformed by  user");
  }
}) 


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
// function NewOrders() {}
function IntiliazeConnection() {}
function SendNewOrder() {}
function SendConfirmation() {}

module.exports = {
  SocketFunction: SocketsFunctions,
};
