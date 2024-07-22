const Hotel = require("../models/Hotel");
const { cloudinary } = require("../utils/cloudniary");
const Owner = require("../models/owner");
const Menu = require("../models/Menu");
const reviews = require("../models/Review");
const Location = require("../models/Location");

const MAPBOX_API_URL = "https://api.mapbox.com/boundaries/v4/mapbox/places";
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZGVlcGFrZ29kYXJhIiwiYSI6ImNsbGh0ZWhldDAycjEzcG5xbmZ2Y3NtcTgifQ.YH0ASk4DJRM5kuTK2FCYxQ";
const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

exports.OwnergetHotel = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id parameter is required" });
    }
    const products = await Hotel.find({ Id: id});
    res.json({
      status: "200",
      hotels: products,
      message: "Content delivered successfully",
    });
  } catch (err) {
    console.error("Error in fetching data:", err);
    res.status(201).json({
      message: "Error in fetching the data",
    });
  }
};

exports.OwnerAddHotel = async (req, res, next) => {
  try {
    const Data = req.body.HotelData;
    const OwnerId = req.params.id;

    console.log("AddHotel "+OwnerId)
    // Upload image to Cloudinary
    const image = await cloudinary.uploader.upload(Data.Image, {
      upload_preset: "Mealify_Hotel_Images",
    });

    if (!image) {
      throw new Error("Error uploading image to Cloudinary");
    }

    // Create new Hotel document
    const hotel = new Hotel({
      Name: Data.HotelName,
      City: Data.City,
      Rating: 0,
      Coordinates: {
        Longitude: Data.Coordinates.lng,
        Latitude: Data.Coordinates.lat,
      },
      Image: image.url,
      Category: ["Pizzas", "North Indian"],
      Id: OwnerId,
    });

    // Save hotel document
    const savedHotel = await hotel.save();
    const hotelId = savedHotel._id;

    // Create new Menu document
    const menu = new Menu({
      Id: hotelId,
      Menu: [],
    });
    await menu.save();

    // Create new Reviews document
    const review = new reviews({
      Id: hotelId,
      Rating: 0,
      Count: 0,
      Review: [],
    });
    await review.save();

    // Update Location document
    let locations = await Location.findOne({ Location: Data.City });
    if (!locations) {
      locations = new Location({
        Location: Data.City,
        Hotels: [{ HotelId: hotelId, Longitude: Data.Coordinates.lng, Latitude: Data.Coordinates.lat }],
      });
    } else {
      locations.Hotels.push({ HotelId: hotelId, Longitude: Data.Coordinates.lng, Latitude: Data.Coordinates.lat });
    }
    await locations.save();

    // Update Owner document with HotelId
    const owner = await Owner.findOne({ _id: OwnerId });
    owner.HotelId = hotelId;
    await owner.save();

    res.json({ status: "200", message: "Hotel added successfully" });
  } catch (err) {
    console.error("Error adding hotel:", err);
    res.status(500).json({
      status: "500",
      error: "Error in Adding the new Hotel, please try again later",
    });
  }
};

exports.getOwnerHotel = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findOne({ _id: hotelId });
    if (!hotel) {
      res.status(404).json({ status: "404", message: "Hotel not found" });
      return;
    }
    res.json({ status: "200", hotel: hotel });
  } catch (err) {
    console.error("Error fetching owner's hotel:", err);
    res.status(500).json({ status: "500", message: "Failed to get the details of the hotel" });
  }
};
