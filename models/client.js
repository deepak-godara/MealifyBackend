const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const { v4: uuidv4 } = require("uuid");
const OrderdSchema = new Schema({
  OrderNumber: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
const AddressesSchema = new Schema({
  Aid: {
    type: String,
    unique: true,
    default: uuidv4,
  },
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
const API_KEY = "AIzaSyCu1pHsemJ5XMhOE36gG9e77EE1VTb1QUM";
const MAPBOX_API_URL = "https://api.mapbox.com/boundaries/v4/mapbox/places";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZGVlcGFrZ29kYXJhIiwiYSI6ImNsbGh0ZWhldDAycjEzcG5xbmZ2Y3NtcTgifQ.YH0ASk4DJRM5kuTK2FCYxQ";
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
  ForeGroundImage: {
    type: String,
  },
  BackGroundImage: {
    type: String,
  },
  Address: [AddressesSchema],
  CurrentActiveAddress: 
    AddressesSchema,
  ReviewCount:{
    type:Number,
    required:true
  }
  
});
// ClientSchema.methods.AddOrder = async function (OrderNumber) {
//   this.Orders.Push({ OrderNumber: OrderNumber });
//   this.save();
// };
ClientSchema.methods.UpdateProfile = async function (Data) {
  try {
    console.log(Data);
    this.DOB = Data.DOB;
    this.Gender = Data.Gender;
    this.PhoneNo = Data.PhoneNo;
    this.Gmail = Data.Gmail;
    this.UserName = Data.UserName;
    return await this.save();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

ClientSchema.methods.AddAddress = async function (Data) {
  try {
    let address = this.Address.length === 0 ? [] : this.Address;
    address.push({
      latitude: Data.Coordinates.lat,
      longitude: Data.Coordinates.lng,
      Address: Data.Address,
      Type: Data.Type,
      AddressLine1: Data.AddLine1,
      AddressLine2: Data.AddLine2,
    });
    this.Address = address;
    return await this.save();
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

ClientSchema.methods.AddFaceImage = async function (id) {
  try {
    this.ForeGroundImage = id;
    return await this.save();
  } catch (error) {
    console.error("Error adding face image:", error);
    throw error;
  }
};

ClientSchema.methods.AddBackImage = async function (id) {
  try {
    this.BackGroundImage = id;
    return await this.save();
  } catch (error) {
    console.error("Error adding back image:", error);
    throw error;
  }
};

ClientSchema.methods.UpdateDefaultAddress = async function (Aid) {
  try {
    let arr = this.Address.filter((key) => key.Aid == Aid);
    console.log(arr);
    this.CurrentActiveAddress = arr[0];
    return await this.save();
  } catch (error) {
    console.error("Error updating default address:", error);
    throw error;
  }
};

ClientSchema.methods.EditProfile = async function (Data) {
  try {
    if (Data.Gender) this.Gender = Data.Gender;
    if (Data.DOB) this.DOB = Data.DOB;
    if (Data.PhoneNo) this.PhoneNo = Data.PhoneNo;
    if (Data.UserName) this.UserName = Data.UserName;
    return await this.save();
  } catch (error) {
    console.error("Error editing profile:", error);
    throw error;
  }
};

ClientSchema.methods.AddOrder = async function (OrderId) {
  try {
    this.Orders.unshift({ OrderNumber: OrderId });
    return await this.save();
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

ClientSchema.methods.AddReviews = async function () {
  try {
    this.ReviewCount += 1;
    return await this.save();
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

module.exports = mongoose.model("client", ClientSchema);
