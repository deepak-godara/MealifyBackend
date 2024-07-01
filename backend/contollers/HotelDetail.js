const Hotel = require("../models/Hotel");
const Menu = require("../models/Menu");

exports.postHotelDish = async (req, res, next) => {
  try {
    const id = req.params.hotelid;
    const { foodname, foodprice, foodtype, foodcategory, fooddescription } = req.body;

    const menu = await Menu.findOne({ Id: id });

    const food = {
      Name: foodname,
      Price: foodprice,
      Foodtype: foodtype,
      foodcategory: foodcategory,
      Description: fooddescription,
    };

    await menu.addDish(food);
    res.json({ status: "200", message: "Dish added successfully", dish: food });
  } catch (err) {
    console.error("Error adding dish:", err);
    res.status(202).json({ status: "202", message: "Error in adding Dish" });
  }
};

exports.getHotelData = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;

    const hotel = await Hotel.findOne({ _id: hotelid });
    const menu = await Menu.findOne({ Id: hotelid });

    res.json({ status: "200", hotel: hotel, Menu: menu });
  } catch (err) {
    console.error("Error fetching hotel data:", err);
    res.status(202).json({ status: "202", message: "Error in Getting Hotel Data" });
  }
};

exports.addFoodCategory = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;
    const category = req.body.category;

    const hotel = await Hotel.findOne({ _id: hotelid });
    await hotel.addCategory(category);

    res.json({ status: "200", message: "Category added" });
  } catch (err) {
    console.error("Error adding food category:", err);
    res.status(202).json({ status: "202", message: "Error adding Category" });
  }
};

exports.deleteFoodItem = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;
    const { foodname, foodcategory } = req.body;

    await Menu.findOneAndUpdate(
      { Id: hotelid, "Menu.Name": foodcategory },
      { $pull: { "Menu.$.items": { Name: foodname } } },
      { new: true }
    );

    res.json({ status: "200", message: "Delete item successfully" });
  } catch (err) {
    console.error("Error deleting food item:", err);
    res.status(202).json({ status: "202", message: "Error in deleting the food item" });
  }
};

exports.getMenu = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;

    const menu = await Menu.findOne({ Id: hotelid });
    res.json({ status: "200", Menu: menu });
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(202).json({ status: "202", message: "Error in Getting Menu" });
  }
};

exports.AddMenuCategory = async (req, res, next) => {
  try {
    const hotelid = req.params.hotelid;
    const category = req.body.category;

    const menu = await Menu.findOne({ Id: hotelid });
    menu.Menu.push({ Name: category, items: [] });
    await menu.save();

    res.json({ status: "200", message: "Category added" });
  } catch (err) {
    console.error("Error adding menu category:", err);
    res.status(202).json({ status: "202", message: "Error adding Category" });
  }
};
