const addHotel = require("../models/Hotel");
const NewOrder = require("../models/NewOrder");
const geolib = require("geolib");
const ActvieOrder = require("../models/ActiveOrder");
const { cloudinary } = require("../utils/cloudniary");
const ActiveOrder = require("../models/ActiveOrder");

exports.getHotel = async (req, res, next) => {
  try {
    const { HotelData, name, price, description } = req.body;

    const image = await cloudinary.uploader.upload(HotelData.Image, {
      upload_preset: "Mealify_Hotel_Images",
    });

    const hotel = new addHotel({
      Name: HotelData.HotelName,
      City: HotelData.City,
      Coordinates: {
        Longitude: HotelData.Coordinates.lng,
        Latitude: HotelData.Coordinates.lat,
      },
      Description: description,
      Image: image.url,
      Category: ["Pizzas", "North Indian"],
    });

    await hotel.save();
    res.status(201).json({ status: "success", message: "Hotel added" });
  } catch (err) {
    res.status(500).json({ message: "Error adding hotel" });
  }
};

exports.postHotel = async (req, res, next) => {
  try {
    const products = await addHotel.find({ Id: "64cbbe0657131325e53d5766" });

    res.json({
      status: "200",
      content: products,
      message: "Content delivered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Error in fetching the data" });
  }
};

exports.getNewOrders = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;
    const orders = await NewOrder.find({ HotelId: hotelid }).exec();

    res.json({ status: "200", Orders: orders });
  } catch (err) {
    res
      .status(500)
      .json({ status: "201", message: "Error fetching new orders" });
  }
};
exports.getActiveOrders = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;
    const orders = await ActiveOrder.find({ HotelId: hotelid }).exec();
    res.status(200).json({ Orders: orders });
  } catch (err) {
    res
      .status(500)
      .json({ status: "201", message: "Error fetching new orders" });
  }
};
exports.getDistances = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;
    const Latitude = req.query.Latitude;
    const Longitude = req.query.Longitude;
    const hotel = await addHotel.findById(hotelid);
    if (hotel) {
      const Dist = geolib.getDistance(
        { latitude: Latitude, longitude: Longitude },
        {
          latitude: hotel.Coordinates.Latitude,
          longitude: hotel.Coordinates.Longitude,
        }
      );
      res.status(200).json({ message: "got the distance", Distance: Dist });
    } else res.status(401).json({ message: "Cannot found hotel" });
  } catch (err) {
    res.status(500).json({ message: "Error while fetching data" });
  }
};
