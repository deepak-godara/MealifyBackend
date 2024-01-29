const Hotel = require("../models/Hotel");
const Menu = require("../models/Menu");
exports.postHotelDish = (req, res, next) => {
  const id = req.params.hotelid;
  console.log(id);
  Menu.findOne({ Id: id })
    .then((hotel) => {
      const food = {
        Name: req.body.foodname,
        Price: req.body.foodprice,
        Foodtype: req.body.foodtype,
        foodcategory: req.body.foodcategory,
        Description: req.body.fooddescription,
      };
      hotel
        .addDish(food)
        .then((result) => {
          // console.log(result.Menu[0].items)
          res.json({ status: "200", message: "Dish added successfully" ,dish:food});
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
      hotel
      console.log(hotel)
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
  const id = req.params.hotelid;
  console.log(req.params.hotelid);
  console.log(req.body);
  const foodname = req.body.foodname;
  const foodcategory = req.body.foodcategory;
  Menu.findOneAndUpdate(
    { Id: id, "Menu.Name": foodcategory },
    { $pull: { "Menu.$.items": { Name: foodname } } },
    { new: true }
  )
    .then((product) => {
      res.json({ status: "200", message: "Delete item successfully" });
    })
    .catch((err) => {
      res.json({ status: "202", message: "error in deleting the food item" });
    });
};
exports.getMenu=(req,res,next)=>{
  const hotelid=req.params.hotelid;
  console.log(hotelid)
  Menu.findOne({Id:hotelid})
  .then((menu)=>{
    console.log(menu)
    res.json({status:"200",Menu:menu});
  })
  .catch((err) => {
    res.json({ status: "202", message: "error in Getting Menu" });
  });
}
exports.AddMenuCategory=async(req,res,next)=>{
const hotelid=req.params.hotelid;
const category=req.body.category;
console.log(category)
Menu.findOne({Id:hotelid})
.then(async(menu)=>{
      menu.Menu.push({Name:category,items:[]})
      await menu.save();;
      res.json({status:"200",message:"Category added"})
})
}