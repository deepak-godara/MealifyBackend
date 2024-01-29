// const { default: mongoose } = require('mongoose');
const { Decimal128, Double } = require("mongodb");
const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const HotelSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  City: {
    type: String,
    required: true,
  },
  Coordinates: {
    Longitude: {
      type: String,
      required: true,
    },
    Latitude: {
      type: String,
      required: true,
    },
  },
  Image: {
    type: String,
    // required: true,
  },
  Rating: {
    type: Mongoose.Schema.Types.Decimal128,
    required: true,
  },
  Category: [
    {
      type: String,
    },
  ],
  Id: {
    type: Schema.Types.ObjectId,
    ref: "owner",
    required: true,
  },
});

HotelSchema.methods.addCategory = async function (category) {
  const Categories = [...this.Category];
  const index = await this.Category.findIndex((item) => {
    return item === category;
  });
  if (index === -1) {
    Categories.push(category);
  }
  this.Category = Categories;
  return this.save();
};
module.exports = Mongoose.model("hotel", HotelSchema);
