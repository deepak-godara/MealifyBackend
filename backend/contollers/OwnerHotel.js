const Hotel = require("../models/Hotel");
const { cloudinary } = require("../utils/cloudniary");
const Menu = require("../models/Menu");
// const fetch=require('node-fetch');
const axios = require("axios");
const reviews = require("../models/Review");
const Location = require("../models/Location");
const MAPBOX_API_URL = "https://api.mapbox.com/boundaries/v4/mapbox/places";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZGVlcGFrZ29kYXJhIiwiYSI6ImNsbGh0ZWhldDAycjEzcG5xbmZ2Y3NtcTgifQ.YH0ASk4DJRM5kuTK2FCYxQ";
// const { default: axios } = require('axios')
const API_KEY = "AIzaSyCu1pHsemJ5XMhOE36gG9e77EE1VTb1QUM";
exports.OwnergetHotel = (req, res, next) => {
  const id = req.params.id;
  Hotel.find({ Id: id })
    .then((products) => {
      console.log(typeof products);
      res.json({
        status: "200",
        hotels: products,
        message: "content dilvered successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(201).json({
        message: "Error in fetching the data",
      });
    });
};
exports.OwnerAddHotel = async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const City = req.body.City;
  const address = req.body.Address;
  const splitedAddress = address.split(",");
  const image = req.body.image;
  const city = encodeURIComponent("address");
  const loca = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const { status, results } = loca.data;
  let lat1, lng1;
  if (status === "OK" && results.length > 0) {
    const { lat, lng } = results[0].geometry.location;
    lat1 = lat;
    lng1 = lng;
  }

  const response = await cloudinary.uploader.upload(image, {
    upload_preset: "Mealify_Hotel_Images",
  });
  const image_id = response.url;
  Hotel.find({ Name: name })
    .then((hotel) => {
      if (hotel.length === 0) {
        const newHotel = new Hotel({
          Name: name,
          City: City,
          Street: splitedAddress[splitedAddress.length - 4],
          Image: image_id,
          Rating: 0,
          Id: id,
        });
        return newHotel.save();
      } else {
        throw err;
      }
    })
    .then((hotel) => {
      const Menus = new Menu({
        Id: hotel._id,
        Menu: [],
      });
      return { id: hotel._id, menu: Menus.save() };
    })
    .then((menu) => {
      const review = new reviews({
        Id: menu.id,
        Rating: 0,
        Count: 0,
        Review: [],
      });
      return { id: menu.id, review: review.save() };
    })
    .then((review) => {
      Location.findOne({ Location: City })
        .then((locations) => {
          if (locations === null || locations.length === 0) {
            let hot = [];
            hot.push({ HotelId: review.id, Longitude: lng1, Latitude: lat1 });
            console.log(hot);
            const newlocation = new Location({
              Location: City,
              Hotels: hot,
            });
            return newlocation.save();
          } else {
            const loco = [...locations.Hotels];
            loco.push({ HotelId: review.id, Longitude: lng1, Latitude: lat1 });
            locations.Hotels = loco;
            return locations.save();
          }
        })
        .then((result) => {
          res.json({ status: "200", message: "HotelAdded successfully" });
        });
    })
    .catch((err) => {
      res.json({
        status: "200",
        error: "Error in Adding the new Hotel try after few minutes",
      });
    });
};
exports.getOwnerHotel = (req, res, next) => {
  const hotelId = req.params.hotelId;
  Hotel.findOne(hotelId)
    .then((hotel) => {
      res.json.status(200)({ status: "200", hotel: hotel });
    })
    .catch((err) => {
      res.json({ stats: "202", message: "Failed to get the Details of Hotel" });
    });
};
