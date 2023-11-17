const Client = require("../models/client");
exports.AddAddress = (req, res, next) => {
  const id = req.params.clientid;
  const Address=req.body.Address;
  Client.findOne({_id:id})
    .then((client) => {
      return client.Addaddress(Address)
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
