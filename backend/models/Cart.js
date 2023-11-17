const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const CartItemSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  FoodType: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
});
const CartSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  HotelName: {
    type: String,
  },
  HotelId: {
    type: String,
  },
  // HotelAddress: {
  //   type: String,
  //   required: true,
  // },
  Items: [CartItemSchema],
  SubTotal: {
    type: Number,
    required: true,
  },
  GST: {
    type: Number,
    required: true,
  },
  Delivery: {
    type: Number,
    required: true,
  },
  Total: {
    type: Number,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
});
CartSchema.methods.addNewCart = async function (Data) {
  try {
    this.HotelName = Data.HotelName;
    this.HotelId = Data.HotelId.toString();
    this.SubTotal = +Data.Price * +Data.Quantity;
    const itemarray = [];
    itemarray.push({
      Name: Data.FoodName,
      FoodType: Data.type,
      Quantity: Data.Quantity,
      Price: Data.Price,
    });
    this.GST = (+Data.Price * +Data.Quantity * 3) / 100;
    this.Delivery = 30;
    this.Total = +this.SubTotal + +this.GST + +this.Delivery;
    this.Items = itemarray;
    return this.save();
  } catch (err) {
    throw err;
  }
};

CartSchema.methods.updateCart = async function (Data) {
  try {
    const Cart = [...this.Items];
    const index = await this.Items.findIndex((item) => {
      return item.Name === Data.FoodName;
    });
    let cost = Data.Quantity * Data.Price;
    console.log(cost);
    if (index != -1) {
      const exisiting = Cart[index];
      console.log(
        this.SubTotal + " " + exisiting.Quantity + " " + exisiting.Price
      );
      const CurrentTotal = this.SubTotal;
      this.SubTotal = CurrentTotal - exisiting.Quantity * exisiting.Price;
      this.Quantity = this.Quantity - exisiting.Quantity + 1;
      Cart[index].Quantity = Data.Quantity;
    } else {
      Cart.push({
        Name: Data.FoodName,
        FoodType: Data.type,
        Quantity: Data.Quantity,
        Price: Data.Price,
      });
    }
    this.Quantity = this.Quantity + +Data.Quantity;
    this.Items = Cart;
    this.SubTotal = +this.SubTotal + +cost;
    this.GST = (this.SubTotal * 3) / 100;
    this.Delivery = 30;
    this.Total = this.SubTotal + this.GST + this.Delivery;
    return this.save();
  } catch (err) {
    throw err;
  }
};
CartSchema.methods.DeleteItem = async function (Data) {
  let ItemtoDelete;
  const updatedCart = await this.items.filter((item) => {
    if (item.FoodName === Data.FoodName) ItemtoDelete = item;
    return item.FoodName !== Data.FoodName;
  });
  this.items = updatedCart;
  this.SubTotal = this.SubTotal - +ItemtoDelete.Price * ItemtoDelete.Quantity;
  this.GST = (this.SubTotal * 3) / 100;
  this.Total = this.SubTotal + this.GST + this.Delivery;
  this.save();
};
CartSchema.methods.DeleteCart = async function () {
  this.Items = [];
  this.Quantity = 0;
  this.SubTotal = 0;
  this.GST = 0;
  this.Delivery = 0;
  this.Total = 0;
  this.HotelName = "null";
  this.HotelId = "null";
  console.log("sdv");
  return this.save();
};
module.exports = Mongoose.model("Cart", CartSchema);
