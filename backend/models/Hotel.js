const mongoose = require("mongoose");
// require('mongoose-double')(mongoose);

const { Schema } = mongoose;
const SchemaTypes = mongoose.Schema.Types;

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
    type: SchemaTypes.Decimal128,
    required: true,
    default: mongoose.Types.Decimal128.fromString('0.0'),
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
  ReviewCount: {
    type: Number,
    required: true,
    default: 0,
  }
});

HotelSchema.methods.addCategory = async function (category) {
  const Categories = [...this.Category];
  const index = this.Category.findIndex((item) => item === category);
  if (index === -1) {
    Categories.push(category);
  }
  this.Category = Categories;
  return this.save();
};

HotelSchema.methods.addReview = async function (Rating) {
  try {
    console.log("Ass")
    const currentRating = parseFloat(this.Rating.toString());
    const newRating = parseFloat(Rating.toString());
    const newReviewCount = this.ReviewCount + 1;

    const newTotalRating = (currentRating * this.ReviewCount + newRating) / newReviewCount;

    this.Rating = mongoose.Types.Decimal128.fromString(newTotalRating.toString());
    this.ReviewCount = newReviewCount;

    return this.save();
  } catch (error) {
    console.log(error)
    throw new Error('Error updating rating: ' + error.message);
  }
};

module.exports = mongoose.model("hotel", HotelSchema);
