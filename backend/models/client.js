const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const OrderdSchema = new Schema({
  OrderNumber: {
    type: Number,
    required: true,
  },
});
const AddressesSchema = new Schema({
  longitude: {
    type: Mongoose.Schema.Types.Decimal128,
    required: true,
  },
  latitude: {
    type: Mongoose.Schema.Types.Decimal128,
    required: true,
  },
  TypeOfAddress: {
    type: String,
    required: true,
  },
  AddressLine1: {
    type: String,
    required: true,
  },
  AddressLine2: {
    type: String,
    required: true,
  },
});
const ClientSchema = new Schema({
  UserName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  PhoneNo: {
    type: Number,
  },
  DOB: {
    type: Date,
  },
  Gender: {
    type: String,
  },
  CurrentActiveAddress: {
    AddressesSchema,
  },
  Orders: [OrderdSchema],
});
ClientSchema.methods.AddOrder = async function (OrderNumber) {
    this.Orders.Push({ OrderNumber: OrderNumber });
    this.save();
  };
  ClientSchema.methods.UpdateProfile = async function (Data) {
    this.DOB = Data.DOB;
    this.Gender = Data.Gender;
    this.PhoneNo = Data.PhoneNo;
    this.Gmail = Data.Gmail;
    this.UserName = Data.UserName;
    return this.save();
  };
  ClientSchema.methods.AddAddress = async function (Data) {
    this.Address = Data;
  };
module.exports = mongoose.model("client", ClientSchema);

