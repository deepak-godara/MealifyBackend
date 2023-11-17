const Hotel = require("../models/Hotel");
const Menu = require("../models/Menu");
exports.postHotelDish = (req, res, next) => {
  const id = req.params.hotelid;
  Menu.findOne({ Id: id })
    .then((hotel) => {
      console.log(hotel);
      const food = {
        name: req.body.foodname,
        price: req.body.foodprice,
        foodtype: req.body.foodtype,
        foodcategory: req.body.foodcategory,
        fooddescription: req.body.fooddescription,
      };
      console.log("f");
      hotel
        .addDish(food)
        .then((result) => {
          res.json({ status: "200", message: "Dish added successfully" });
        })
        .catch((err) => {
          res.json({ status: "202", message: "Error in adding Dish" });
        });
    })
    .catch((err) => {
      res.json({ status: "202", message: "Error in adding Dish" });
    });
};
exports.getHotelData = (req, res, next) => {
  console.log("yes giving data");
  Hotel.findOne({ _id: req.params.hotelid })
    .then((hotel) => {
      Menu.findOne({ Id: req.params.hotelid })
        .then((Menu) => {
          res.json({ status: "200", hotel: hotel, Menu: Menu });
        })
        .catch((err) => {
          res.json({ status: "202", message: "Error in Getting Hotel Data" });
        });
    })
    .catch((err) => {
      res.json({ status: "202", message: "Error in Getting Hotel Data" });
    });
};
exports.addFoodCategory = (req, res, next) => {
  Hotel.findOne({ _id: req.params.hotelid })
    .then((hotel) => {
      console.log(hotel);
      hotel
        .addCategory(req.body.category)
        .then((result) => {
          res.json({ status: "200", message: "add Category" });
        })
        .catch((err) => {
          res.json({ status: "202", message: err });
        });
    })
    .catch((err) => {
      res.json({ status: "202", message: err });
    });
};
exports.deleteFoodItem = (req, res, next) => {
  console.log("delete");
  const id = req.params.hotelid;
  const foodname = req.body.foodname;
  const foodcategory = req.body.foodcategory;
  console.log(id + "   " + foodname + "  " + foodcategory);
  Menu.findOneAndUpdate(
    { Id: id, "Menu.Name": foodcategory },
    { $pull: { "Menu.$.items": { Name: foodname } } },
    { new: true }
  )
    .then((product) => {
      console.log("sjjkdsv");
      res.json({ status: "200", message: "Delete item successfully" });
    })
    .catch((err) => {
      res.json({ status: "202", message: "error in deleting the food item" });
    });
};
