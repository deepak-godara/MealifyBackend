const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  OwnerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "owner",
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
  UserDeliveryConfirmation: {
    type: Boolean,
    required: true,
  },
  HotelDeliveryConfirmation: {
    type: Boolean,
    required: true,
  },
  Status: {
    type: [String],
    default: ["Accpeted"]
  },
  DeliveryId:{
    type:Number,
    default:""
  } 
});

ActiveOrderSchema.methods.Initiate = async function (Data) {
  try {
    this.HotelName = Data.HotelName;
    this.UserId = Data.UserId;
    this.RoomId = Data.RoomId;
    this.HotelAddress = Data.HotelAddress;
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
    this.OrderDetails = {
      Date: "sdvd",
      Payment: "Cash On Delivery",
      DeliverTo: Data.OtherDetails.UserAddress,
      PhoneNo: Data.OtherDetails.PhoneNo,
    };
    this.Status = [...new Set(this.Status).add("Accepted")];
    return await this.save();
  } catch (error) {
    console.error("Error initiating order:", error);
    throw error; // Re-throw the error after logging it
  }
};

ActiveOrderSchema.methods.addStatus = async function (status) {
  try {
    this.Status = [...new Set(this.Status).add(status)];
    return await this.save();
  } catch (error) {
    console.error("Error adding status:", error);
    throw error; // Re-throw the error after logging it
  }
};


module.exports = mongoose.model("ActiveOrder", ActiveOrderSchema);
