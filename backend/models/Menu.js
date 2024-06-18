const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const itemSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  FoodType: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
});
const MenuSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  items: [itemSchema],
});
const MenuSchemas = new Schema({
  Id: {
    type: Schema.Types.ObjectId,
    ref: "hotel",
    required: true,
  },
  Menu: [MenuSchema],
});
MenuSchemas.methods.addDish = async function (dish) {
  console.log("sdvnjsvsvns");
  const check = await this.Menu.findIndex((item) => {
    return item.Name === dish.foodcategory;
  });
  const MenuData = [...this.Menu];
  if (check !== -1) {
    MenuData[check].items.push({
      Name: dish.Name,
      Price: dish.Price,
      FoodType: dish.Foodtype,
      Description: dish.Description,
    });
  } else {
    const NewFoodCategory = [];
    NewFoodCategory.push({
      Name: dish.Name,
      Price: dish.price,
      FoodType: dish.Foodtype,
      Description: dish.fDscription,
    });

    MenuData.push({
      Name: dish.foodcategory,
      items: NewFoodCategory,
    });
  }

  this.Menu = MenuData;
  return this.save();
};
module.exports = Mongoose.model("Menu", MenuSchemas);
