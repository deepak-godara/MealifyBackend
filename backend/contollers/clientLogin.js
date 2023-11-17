const clientLogin = require("../models/client");
const Cart = require("../models/Cart");
console.log("hii");
exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const CurrentAddress = {};
  const Client = new clientLogin({
    UserName: username,
    Password: password,
    Email: email,
    PhoneNo:0,
    Gneder:"None",
    DOB:"None",
    Address: [],
    CurrentActiveAddress: {
      longitude: 0.0,
      latitude: 0.0,
      Address: "Empty",
      Type:"Home",
      AddressLine1:"",
      AddressLine2:"",
    },
  });
  clientLogin.findOne({ Email: email}).then((user) => {
    if (user) {
      res.json({ status: "202", message: "UserName already in use" });
    } else {
      Client.save()
        .then((result) => {
          console.log("Client-saved");
          const newCart = new Cart({
            UserId: result._id,
            Items: [],
            SubTotal: 0,
            GST:0,
            Delivery:0,
            Total: 0,
            Quantity:0,
          });
          newCart
            .save()
            .then((result) => {
              res.json({ status: "200", message: "add successfully" });
            })

            .catch((err) => {
              console.log(err);
              res.json({
                statsu: "202",
                message:
                  "Error in Getting you Registered try after few Minutes",
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            statsu: "202",
            message: "Error in Getting you Registered try after few Minutes",
          });
        });
    }
  });
};
exports.getLogined = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  clientLogin
    .findOne({ UserName: username })
    .then((user) => {
      if (!user) {
        res
          .status(202)
          .json({ message: "UserName is Incorrect", status: "202" });
      } else {
        if (user.Email !== email && user.Password !== password)
          res
            .status(202)
            .json({
              message: "Email  and Password are Incorrect",
              status: "202",
            });
        else if (user.Email !== email)
          res
            .status(202)
            .json({ message: "Email is Incorrect", status: "202" });
        else if (user.Password !== password)
          res
            .status(202)
            .json({ message: "Password is Incorrect", status: "202" });
        else {
          res
            .status(200)
            .json({
              status: "200",
              user: user,
              message: "Successfully loggined",
            });
        }
      }
    })
    .catch((err) => {
      throw err;
    });
};
