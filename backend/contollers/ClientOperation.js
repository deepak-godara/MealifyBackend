const mongoose = require('mongoose');
const Client = require("../models/client");
const Orders = require("../models/ActiveOrder");
const { cloudinary } = require("../utils/cloudniary");

exports.AddAddress = async (req, res, next) => {
  try {
    const id = req.params.clientid;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid client  ID' });
    }
    const Address = req.body.Address;
    const client = await Client.findOne({ _id: id });
    await client.Addaddress(Address);
    res.status(200).json({ message: "Address added successfully" });
  } catch (err) {
    console.error("Error in adding address:", err);
    res.status(202).json({ message: "Error in adding address" });
  }
};

exports.AddForeImage = async (req, res, next) => {
  try {
    const id = req.params.clientid;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid client  ID' });
    }
    const image = await cloudinary.uploader.upload(req.body.Image, {
      upload_preset: "Mealify_Hotel_Images",
    });
    const url = image.url;
    const client = await Client.findOne({ _id: id });
    await client.AddForeImage(url);
    res.status(200).json({ message: "Foreground image added successfully" });
  } catch (err) {
    console.error("Error in adding foreground image:", err);
    res.status(202).json({ message: "Error in adding foreground image" });
  }
};

exports.AddBackImage = async (req, res, next) => {
  try {
    const id = req.params.clientid;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid client  ID' });
    }
    const image = await cloudinary.uploader.upload(req.body.Image, {
      upload_preset: "Mealify_Hotel_Images",
    });
    const url = image.url;
    const client = await Client.findOne({ _id: id });
    await client.AddBackImage(url);
    res.status(200).json({ message: "Background image added successfully" });
  } catch (err) {
    console.error("Error in adding background image:", err);
    res.status(202).json({ message: "Error in adding background image" });
  }
};

exports.ClientData = async (req, res, next) => {
  try {
    const id = req.params.clientid;
    // if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).send({ message: 'Invalid client  ID' });
    // }
    const client = await Client.findOne({ _id: id });
    res.status(200).json({ status: "200", message: "Data fetched", Data: client });
  } catch (err) {
    console.error("Error in fetching client data:", err);
    res.status(202).json({ status: "202", message: "Error in fetching client data" });
  }
};

exports.UpdateProfile = async (req, res, next) => {
  try {
    const id = req.params.clientid;
    const data = req.body.Data;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid client  ID' });
    }
    const client = await Client.findOne({ _id: id });
    await client.UpdateProfile(data); 
    res.json({ status: "200", message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error in updating profile:", err);
    res.json({ status: "202", message: "Error in updating profile" });
  }
};

exports.Getorderdetails = async (req, res, next) => {
  try {
    const id = req.params.orderid;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid order ID' });
    }
    const order = await Orders.findOne({ _id: id });
    res.json({ status: "200", message: "Success", order: order, id: id });
  } catch (err) {
    console.error("Error in fetching order details:", err);
    res.json({ status: "202", message: "Error in fetching order details" });
  }
};

