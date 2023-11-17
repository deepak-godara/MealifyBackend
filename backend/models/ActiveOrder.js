const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const MessageSchema = new Schema({
  Sender: {
    Id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    Message: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
  },
});
const ActiveOrderSchema = new Schema({
  OrderNumber: {
    type: Number,
    required: true,
  },
  RoomNo: {
    type: Number,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  UserId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  HotelId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  Messages: [MessageSchema],
});
ActiveOrderSchema.methods.AddMessage=async function(Message,Id){
    this.Messages.push({Message:Message,Id:Id,Name:Name});
    return this.save();
}