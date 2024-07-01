const Client = require("../models/client");
const Cart = require("../models/Cart");

exports.getCart = async (req, res, next) => {
  try {
    const id = req.params.client;
    const cart = await Cart.findOne({ UserId: id });
    res.json({ status: "200", Cart: cart });
  } catch (err) {
    res.json({
      status: "202",
      message: "Error in getting your cart. Please try again in a few minutes.",
    });
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const id = req.params.client;
    const hotelid = req.body.Data.HotelId;
    const Data = req.body.Data;
    const allow = req.query.allow;

    const cart = await Cart.findOne({ UserId: id });

    if (!cart) {
      return res.json({ status: "204", message: "Cart not found" });
    }

    if (!cart.HotelId) {
      await cart.addNewCart(Data);
      res.json({ status: "200", message: "Item added successfully" });
    } else {
      if (cart.HotelId.toString() !== hotelid.toString()) {
        if (allow === "true") {
          await cart.DeleteCart();
          await cart.addNewCart(Data);
          res.json({ status: "200", message: "Item added successfully" });
        } else {
          res.json({ status: "203", message: "Hotel name different" });
        }
      } else {
        await cart.updateCart(Data);
        res.json({ status: "200", message: "Item added successfully" });
      }
    }
  } catch (err) {
    res.json({ status: "204", message: "Error adding item to cart" });
  }
};
