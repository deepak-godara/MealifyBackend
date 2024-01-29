const Client = require("../models/client");
const { cloudinary } = require("../utils/cloudniary");
exports.AddAddress = (req, res, next) => {
  const id = req.params.clientid;
  const Address = req.body.Address;
  Client.findOne({ _id: id })
    .then((client) => {
      return client.Addaddress(Address);
    })
    .then((Address) => {
      res.status(200).json({
        message: "AddressAdded",
      });
      return;
    })
    .catch((err) => {
      res.status(202).json({
        message: "Error in Adding",
      });
    });
};
exports.AddForeImage = async (req, res, next) => {
  const id = req.params.clientid;
  let url;
  cloudinary.uploader
    .upload(req.body.Image, {
      upload_preset: "Mealify_Hotel_Images",
    })
    .then((image) => {
      url = image.url;
      Client.findOne({ _id: id }).then((client) => {
        return client.AddBackImage(url);
      });
    })
    .then((image) => {
      res.status(200).json({ message: "Fore BackGround Image Added" });
    })
    .catch((err) => {
      res.json({ status: "202", Message: "Error in updating profile" });
    });
};
exports.AddBackImage = async (req, res, next) => {
  const id = req.params.clientid;
  let url;
  cloudinary.uploader
    .upload(req.body.Image, {
      upload_preset: "Mealify_Hotel_Images",
    })
    .then((image) => {
      url = image.url;
      Client.findOne({ _id: id }).then((client) => {
        return client.AddFaceImage(url);
      });
    })
    .then((image) => {
      res.status(200).json({ message: "Fore BackGround Image Added" });
    })
    .catch((err) => {
      res.json({ status: "202", Message: "Error in updating profile" });
    });
};
exports.ClientData = async (req, res, next) => {
  const id = req.params.clientid;
  Client.findOne({ _id: id }).then((client) => {
    res
      .status(200)
      .json({ status: "200", message: "Data fetched", Data: client });
  });
};
exports.UpdateProfile = async (req, res, next) => {
  const id = req.params.clientid;
  console.log(req.body.Data);
  Client.findOne({ _id: id })
    .then((client) => {
      console.log(client);
      return client.UpdateProfile(req.body.Data);
    })
    .then((result) => {
      res.json({ status: "200", Message: "Proffile Updated Successfully" });
    })
    .catch((err) => {
      res.json({ status: "202", Message: "Error in updating profile" });
    });
};
