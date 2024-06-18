const Client = require("../models/client");
const Cart = require("../models/Cart");
exports.getCart = (req, res, next) => {
  const id = req.params.client;
  Cart.findOne({ UserId: id })
    .then((cart) => {
      console.log("yes");
      res.json({ status: "200", Cart: cart });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        status: "202",
        message: "Error in Getting you Registered try after few Minutes",
      });
    });
};
exports.addToCart = (req, res, next) => {
  const id = req.params.client;
  const hotelid = req.body.Data.HotelId;
  const Data = req.body.Data;
  const allow = req.query.allow;
  console.log(id);
  Cart.findOne({ UserId: id })
    .then((cart) => {
      console.log(cart);
      if (!cart.HotelId) {
        cart.addNewCart(Data).then((carts) => {
          res.json({ status: "200", message: "item added successfully" });
        });
      } else {
        console.log(cart.HotelId);
        if (cart.HotelId.toString() !== hotelid.toString()) {
          if (allow === "true") {
            cart.DeleteCart().then((carts) => {
              carts.addNewCart(Data).then((carts) => {
                res.json({ status: "200", message: "item added successfully" });
              });
            });
          } else res.json({ status: "203", message: "Hotel Name Different" });
        } else {
          cart.updateCart(Data).then((carts) => {
            res.json({ status: "200", message: "item added successfully" });
          });
        }
      }
    })
    .catch((err) => {
      res.json({ status: "204", message: "Hotel Name Different" });
    });
};
// exports.DeleteCartItems=(req,res,next)={
// const id=req.params.id
// }