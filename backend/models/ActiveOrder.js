const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const OrderItemSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  FoodType: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Total: {
    type: Number,
    required: true,
  },
});
const ActiveOrderSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "client",
  },
  HotelName: {
    type: String,
    required: true,
  },
  OrderId: {
    type: String,
    required: true,
  },
  OrderStatus: {
    type: String,
    required: true,
  },
  HotelId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  OwnerId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:"owner"
  },
  HotelAddress: {
    type: String,
    required: true,
    ref: "hotel",
  },
  Items: [OrderItemSchema],
  ItemTotal: {
    type: Number,
    required: true,
  },
  GST: {
    type: Number,
    required: true,
  },
  Delivery: {
    type: Number,
    required: true,
  },
  Total: {
    type: Number,
    required: true,
  },
  OrderDetails: {
    Date: {
      type: String,
      required: true,
    },
    Payment: {
      type: String,
      required: true,
    },
    DeliverTo: {
      type: String,
      required: true,
    },
    PhoneNo: {
      type: Number,
      required: true,
    },
  },
  UserDeliveryConfirmation:{
    type:Boolean,
    required:true
  },
  HotelDeliveryConfirmation:{
    type:Boolean,
    required:true
  },
});
ActiveOrderSchema.methods.Initiate = async function (Data) {
  this.HotelName = Data.HotelName;
  this.UserId = Data.UserId;
  this.RoomId = Data.RoomId;
  this.HotelAddress = Data.HotelAddress, 
  this.HotelId = Data.HotelId;
  this.OrderStatus = "Order been prepared";
  this.Items = Data.item.map((items) => {
    return {
      ...items,
      Total: +items.Price * +items.Quantity,
    };
  });
  this.ItemTotal = Data.SubTotal;
  this.GST = Data.GST;
  this.Delivery = Data.Delivery;
  this.Total = Data.Total;
  this.OrderDetail = {
    Date: "sdvd",
    Payment: "Cash On Delivery",
    DeliverTo: Data.OtherDetails.UserAddress,
    PhoneNo: Data.OtherDetails.PhoneNo,
  };
  return this.save();
};
module.exports=Mongoose.model("ActiveOrder",ActiveOrderSchema)