const Hotel = require("../models/Hotel");
const AddOrder=require("./DataStructures").AddOrder
const OwnerFind=require("./DataStructures").OwnerFind
const NewOrders = require("../models/NewOrder");
let OrderCount=0;
function AddOrders(socket,io){
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
          let Owner= await OwnerFind(hotel.Id)
          if (Owner!=null) {     
            const ids = String(Owner)
            const CurrentDate = new Date(); 
            const formattedDate = CurrentDate.toISOString()
              .slice(0, 10)
              .replace(/-/g, "");
    
            OrderCount += 1; // Increment the order count
            console.log(OrderCount);
    
            const Order = new NewOrders({
              HotelName: Cart.HotelName,
              UserId: UserId,
              OrderId: `${formattedDate}${OrderCount}`,
              HotelAddress: hotel.City,
              HotelId: Cart.HotelId,
              OwnerId: hotel.Id,
              OrderStatus: "Order pending for approval",
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
     console.log(ids)
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
                    console.log("ji");
                  const pairs = [[Order.UserId, Order.HotelId], CurrentDate];
                  
                  await Order.save();
                  AddOrder(Order.OrderId, pairs);
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
    
}
module.exports={
    AddOrder:AddOrders
}