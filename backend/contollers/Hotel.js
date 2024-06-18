const addHotel = require("../models/Hotel");
const NewOrder=require("../models/NewOrder")
const { cloudinary } = require("../utils/cloudniary");
exports.getHotel = async(req, res, next) => {
  const Data = req.body.HotelData;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  cloudinary.uploader.upload(Data.Image,{
    upload_preset: "Mealify_Hotel_Images",
  }).then((image)=>{
    const hotel = new addHotel({
      Name: Data.HotelName,
      City: Data.City,
      Coordinates: {
        Longitude: Data.Coordinates.lng,
        Latitude: Data.Coordinates.lat,
      },
      Description: description,
      Image:image.url,
      Category:["Pizzas","North Indian"]
    });
    hotel
      .save()
      .then((result) => {
        res.status(201).json({ status1: "success", message: "hotel added" });
      })
      .catch((err) => console.log(err));
  })
 
};
exports.postHotel = (req, res, next) => {
  addHotel
    .find({ Id: "64cbbe0657131325e53d5766" })
    .then((products) => {
      res.json({
        status: "200",
        content: products,
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
exports.getNewOrders=(req,res,next)=>{
  const hotelid=req.params.hotelid
  NewOrder.find({HotelId:hotelid})
  .exec()
  .then((orders)=>{
    console.log(typeof orders+" orders")
    res.json({status:"200", Orders:orders});
  })
  .catch(err=> {
    res.json({status:"201", message:"Error in fecthing the New Orders"})}
    )

};