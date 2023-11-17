const addHotel = require("../models/Hotel");
exports.getHotel = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const hotel = new addHotel({
    Name: name,
    Price: price,
    Description: description,
  });
  hotel
    .save()
    .then((result) => {
      console.log("hotel saved");
      res.status(201).json({ status1: "success", message: "hotel added" });
    })
    .catch((err) => console.log(err));
};
exports.postHotel = (req, res, next) => {
  console.log("get hotels");
  addHotel
    .find({ Id: "64cbbe0657131325e53d5766" })
    .then((products) => {
      console.log(products);
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
