let ActiveOwners = new Map();
let ActiveUsers = new Map();
let ActiveOrders = new Map();
let NewOrder = new Map();
let OwnerOrderMap=new Map();
let OrderCount = 0;
const Hotel = require("../models/Hotel");
const Carts=require("../models/Cart")
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
    try{
    console.log(message);
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
      ActiveOwners.set(UserId, Socketid);
    }
    console.log(ActiveOwners);
    console.log(ActiveUsers);
  }
catch(err){
  console.log(err);
}}
  );
  socket.on("message", ({ Cart }) => {
    console.log(Cart);
    // console.log(socket.id)
  });
  socket.on("NewOrder", async ({ id, Cart, UserId }) => {
    Hotel.findOne({ _id: id }).then(async (hotels) => {
      console.log("got the owner", hotels.Id)
      console.log(ActiveOwners.has(hotels.Id.toString()))
      if (ActiveOwners.has(hotels.Id.toString())) {
        console.log("got the owner")
        const ids = ActiveOwners.get(hotels.Id.toString());
        const CurrentDate = new Date();
        const formattedDate = CurrentDate.toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        OrderCount = OrderCount + 1;
        console.log(OrderCount);
        // const pair = ActiveOwners[ids];
        // console.log(pair[0]);
        const Order = new NewOrders({
          HotelName: Cart.HotelName,
          UserId: UserId,
          OrderId: `${formattedDate}${OrderCount}`,
          HotelAddress: hotels.City,
          HotelId: Cart.HotelId,
          OwnerId: hotels.Id,
          Items: Cart.Items.map((items) => {
            return {
              ...items,
              Total: +items.Price * +items.Quantity,
            };
          }),
          ItemTotal: Cart.BillDetails.SubTotal,
          GST: Cart.BillDetails.GST,
          Delivery: Cart.BillDetails.Delivery,
          Total: Cart.BillDetails.Total,
          OrderDetails: {
            Date: "sdvd",
            Payment: "Cash On Delivery",
            DeliverTo: "sdvvs",
            PhoneNo: 123456778,
          },
        });
        await Order.save();
        console.log(ids)
        await Carts.findOne({UserId:UserId}).then(
          Carts=>{
               Carts.HotelId=null;
               Carts.HotelName=null;
               Carts.Items=[]
               Carts.SubTotal=0;
               Carts.GST=0;
               Carts.Delivery=0;
               Carts.Total=0;
               Carts.Quantity=0;
               return Carts.save()
          }
        )
       
        await io.to(ids).emit(
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
              const pairs = [[Order.UserId, Order.HotelId], CurrentDate];
              NewOrder.set(Order.OrderId, pairs);
              console.log("added new order")
            } else {
              NewOrders.findOneAndDelete({ OrderId: Order.OrderId });
              socket.emit("OrderConfirmation", {
                message:
                  "Can't place your order as hotel has turned of new orders",
                code: 201,
              });
            }
          }
        );
      } else {
        socket.emit("OrderConfirmation", {
          message: "Can't place your order as hotel has turned of new orders",
          code: 201,
        });
      }
    });
  });
  socket.on(
    "OrderConfirmationFromHotel",
    async ({ orderid, code, OrderData }) => {
      console.log(orderid + " " + code);
      const CurrentDate = new Date();
      if (NewOrder.has(orderid)) {
        console.log("verfied the order")
        const Order = NewOrder.get(orderid);
        console.log(Order)
        if (Math.abs(CurrentDate - Order[1]) / 1000 <= 60) {
          if (ActiveUsers.has(Order[0][0].toString())) {
            const socketId = ActiveUsers.get(Order[0][0].toString());
            if (code === 0) {
              console.log("order rejeected")
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
              console.log(OrderData);
              delete OrderData._id;
              const ActOrder = { ...OrderData, OrderStatus: "Accepted",OwnerId:Order[0][1] };
              const NewActiveOrder = new Activeorders(ActOrder);
              await NewActiveOrder.save();
              ActiveOrders.set(orderid, OrderData);
              NewOrder = await NewOrderFilter(orderid, NewOrder);
              await NewOrders.deleteOne({ OrderId: orderid });
            }
          } else {
          }
        }
        else{
          console.log('order recieved late')
          NewOrder = await NewOrderFilter(orderid, NewOrder);
          await NewOrders.deleteOne({ OrderId: orderid });
        }
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
// function NewOrders() {}
function IntiliazeConnection() {}
function SendNewOrder() {}
function SendConfirmation() {}

module.exports = {
  SocketFunction: SocketsFunctions,
};
