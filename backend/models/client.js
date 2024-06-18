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
  Address: {
    type: String,
    required: true,
  },
  Type: {
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
  ForeGroundImage:{
    type:String
  },
  BackGroundImage:{
    type:String
  },
  Address: [AddressesSchema],
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
  console.log(Data);
  this.DOB = Data.DOB;
  this.Gender = Data.Gender;
  this.PhoneNo = Data.PhoneNo;
  this.Gmail = Data.Gmail;
  this.UserName = Data.UserName;
  return this.save();
};
ClientSchema.methods.Addaddress = async function (Data) {

  let address;
  if (this.Address.length === 0) {
    address = [];
    address.push();
  } else address = this.Address;
  address.push({
    latitude: Data.Coordinates.lat,
    longitude: Data.Coordinates.lng,
    Address: Data.Address,
    Type: Data.Type,
    AddressLine1: Data.AddLine1,
    AddressLine2: Data.AddLine2,
  });
  this.Address = address;
  return this.save();
};
ClientSchema.methods.AddFaceImage=async function (id){
  this.ForeGroundImage=id;
  return this.save();
}
ClientSchema.methods.AddBackImage=async function(id){
  this.BackGroundImage=id;
  return this.save();
}
ClientSchema.methods.EditProfile=async function(Data){
  if(Data.Gender)
  this.Gender=Data.Gender;
  if(Data.DOB)
  this.DOB=Data.DOB;
  if(Data.PhoneNo)
  this.PhoneNo=Data.PhoneNo;
if(Data.UserName)
this.UserName=Data.UserName;
return this.save();
}
module.exports = mongoose.model("client", ClientSchema);
