const asyncHandler = require("express-async-handler");
const User = require("../models/client");
const getAddress = asyncHandler(async (req, res) => {
  const Cid = req.params.Cid;

  try {
    const user = await User.findById(Cid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      const address = user.Address;
      if (address.length !== 0) {
        return res.status(200).json(address);
      } else {
        return res.status(404).json({ error: "No address found for the user" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error retrieving address" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
});

const deleteAddress = asyncHandler(async (req, res) => {
  const { Cid, Aid } = req.params;
  try {
    const user = await User.findById(Cid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const address = user.Address;
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    const addressIndex = address.findIndex((add) => add.Aid.toString() === Aid);
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Intended address is not found" });
    }
    address.splice(addressIndex, 1);
    await user.save();
    res.status(200).json(user.Address);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
const SetDefaultAddress = asyncHandler(async (req, res) => {
  const { Cid} = req.params;
  const Aid=req.body.Aid
  try {
    const user = await User.findOne({_id:Cid});
    console.log(user)
    if (!user) {
      res.status(500).json({ message: "external", err });
    } else {
      await user.UpdateDefaultAddress(Aid);
      res.status(200).json({ message: "Cid update Correctly", Address:user});
    }
  } catch (err) {
    res.status(500).json({ message: "Internalbb server error", err });
  }
});
module.exports = { getAddress, deleteAddress,SetDefaultAddress };
