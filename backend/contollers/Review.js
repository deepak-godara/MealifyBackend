const Hotel = require("../models/Hotel");
const Client = require("../models/client");
const mongoose = require("mongoose");
const Reviews = require("../models/Review");

exports.AddReview = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { HotelId, UserId, Rating, Review } = req.body;

    const owner = await Hotel.findById(HotelId).session(session);
    const client = await Client.findById(UserId).session(session);

    if (!owner || !client) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: "Error in finding hotel or user" });
      return;
    }

    console.log("Hotel and client found");

    const review = new Reviews({
      HotelId: HotelId,
      UserId: UserId,
      Rating: Rating,
      Review: Review,
    });

    await review.save({ session });

    console.log("Review saved to the database");

    await owner.addReview(mongoose.Types.Decimal128.fromString(Rating.toString()), { session });
    await client.AddReviews({ session });

    await session.commitTransaction();
    session.endSession();

    console.log("Reviews added to hotel and client");

    res.status(200).json({ message: "Added Review" });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.status(401).json({ message: "Error in Adding the review" });
  }
};
