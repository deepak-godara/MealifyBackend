const clientLogin = require("../models/client");
const Cart = require("../models/Cart");

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await clientLogin.findOne({ Email: email });
    if (existingUser) {
      return res.json({ status: "202", message: "Email already in use" });
    }

    const Client = new clientLogin({
      UserName: username,
      Password: password,
      Email: email,
      ForeGroundImage: null,
      BackGroundImage: null,
      Address: [],
    });

    const savedClient = await Client.save();

    const newCart = new Cart({
      UserId: savedClient._id,
      Items: [],
      SubTotal: 0,
      GST: 0,
      Delivery: 0,
      Total: 0,
      Quantity: 0,
    });

    await newCart.save();
    res.json({ status: "200", message: "Registered successfully" });
  } catch (err) {
    res.json({
      status: "202",
      message: "Error in getting you registered. Please try again in a few minutes.",
    });
  }
};

exports.getLogined = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const user = await clientLogin.findOne({ UserName: username });

    if (!user) {
      return res.status(202).json({ message: "Username is incorrect", status: "202" });
    }

    if (user.Email !== email && user.Password !== password) {
      return res.status(202).json({ message: "Email and Password are incorrect", status: "202" });
    }

    if (user.Email !== email) {
      return res.status(202).json({ message: "Email is incorrect", status: "202" });
    }

    if (user.Password !== password) {
      return res.status(202).json({ message: "Password is incorrect", status: "202" });
    }

    res.status(200).json({ status: "200", user: user, message: "Successfully logged in" });
  } catch (err) {
    res.status(500).json({ status: "500", message: "An error occurred. Please try again later." });
  }
};
