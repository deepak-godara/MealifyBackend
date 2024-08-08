const asyncHandler = require("express-async-handler");
const Hotel = require("../models/Hotel");
const Client = require("../models/client");
const ActiveOrder = require("../models/ActiveOrder");
const mongoose = require("mongoose");
const Reviews = require("../models/Review");

const AddReview = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { OrderId, Rating, Review } = req.body;
    const order = await ActiveOrder.findById(OrderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }
    const owner = await Hotel.findById(order.HotelId).session(session);
    const client = await Client.findById(order.UserId).session(session);

    if (!owner || !client) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Hotel or user not found" });
    }
    console.log("Hotel and client found");
    const review = new Reviews({
      HotelId: order.HotelId,
      UserId: order.UserId,
      Rating,
      Review,
    });
    await review.save({ session });
    console.log("Review saved to the database");
    // await owner.addReview(mongoose.Types.Decimal128.fromString(Rating.toString()), { session });
    await client.AddReviews({ session });
    await session.commitTransaction();
    session.endSession();
    console.log("Reviews added to hotel and client");
    res.status(200).json({ message: "Added Review" });
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Error in Adding the review" });
  }
});

const GetOwnerReview = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log("Id is:", id);
  const Pagenumber = req.query.PageNumber;
  const PageSize = req.query.PageSize;

  try {
    const reviews = await Reviews.find({ HotelId: id })
      .skip(Pagenumber * PageSize)
      .limit(PageSize);

    if (!reviews || reviews.length === 0) {
      return res.status(200).json([]);
    }

    const reviewsWithUser = await Promise.all(
      reviews.map(async (review) => {
        const user = await Client.findById(review.UserId);
        if (!user) {
          return null;
        }
        return {
          review,
          user: {
            profilePhoto: user.ForeGroundImage,
            name: user.UserName,
          },
        };
      })
    );

    const filteredReviews = reviewsWithUser.filter((item) => item !== null);
    // console.log("Filtered reviews:", filteredReviews);

    res.status(200).json(filteredReviews);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

const getUserReviews = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log("fisnccns");
  const Pagenumber = req.query.PageNumber;
  const PageSize = req.query.PageSize;
  console.log("user is:", id, Pagenumber, PageSize);

  try {
    const reviews = await Reviews.find({ UserId: id })
      .skip(Pagenumber * PageSize)
      .limit(PageSize);
    if (!reviews || reviews.length === 0) {
      return res.status(200).json([]);
    }

    const totalReviews = await Promise.all(
      reviews.map(async (review) => {
        const hotel = await Hotel.findById(review.HotelId);
        if (!hotel) return null;
        return {
          review,
          hoteldata: {
            Image: hotel.Image,
            Name: hotel.Name,
          },
        };
      })
    );

    const filteredTotalReviews = totalReviews.filter((item) => item !== null);

    return res.status(200).json(filteredTotalReviews);
    console.log("useReview Data  sent successfully!!!");
  } catch (error) {
    console.error("Internal error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { AddReview, GetOwnerReview, getUserReviews };
