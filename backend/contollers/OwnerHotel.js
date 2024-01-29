const Hotel = require("../models/Hotel");
const { cloudinary } = require("../utils/cloudniary");
const Owner = require("../models/owner");
const Menu = require("../models/Menu");
const NewOrder=require("../models/NewOrder")
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
  const Data = req.body.HotelData;
  const OwnerId = req.params.id;
  let hotelid = null;
  console.log(Data)
  cloudinary.uploader
    .upload(Data.Image, {
      upload_preset: "Mealify_Hotel_Images",
    })
    .then((image) => {
      console.log(image);
      if (image) {
        const hotel = new Hotel({
          Name: Data.HotelName,
          City: Data.City,
          Rating:0,
          Coordinates: {
            Longitude: Data.Coordinates.lng,
            Latitude: Data.Coordinates.lat,
          },
          Image: image.url,
          Category: ["Pizzas", "North Indian"],
          Id: OwnerId,
        });
        return hotel.save();
      } else {
        throw err;
      }
    })
    .then((hotel) => {
      console.log(hotel)
      hotelid=hotel._id;
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
      Location.findOne({ Location: Data.City })
        .then((locations) => {
          if (locations === null || locations.length === 0) {
            let hot = [];
            hot.push({
              HotelId: review.id,
              Longitude: Data.Coordinates.lng,
              Latitude: Data.Coordinates.lat,
            });
            const newlocation = new Location({
              Location: Data.City,
              Hotels: hot,
            });
            return {id:review.id,location:newlocation.save()};
          } else {
            const loco = [...locations.Hotels];
            loco.push({ HotelId: review.id, Longitude: Data.Coordinates.lng,
              Latitude: Data.Coordinates.lat,});
            locations.Hotels = loco;
            return {id:review.id,location:locations.save()};
          }
        })
      })
        .then(async(result) => {
          console.log(result)
          Owner.findOne({_id:OwnerId})
          .then(async(owner)=>{
               owner.HotelId=hotelid;
               
               await owner.save();
               console.log("hotel added")
            res.json({ status: "200", message: "HotelAdded successfully" });
          })
         
        })
    .catch((err) => {
      console.log(err)
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
