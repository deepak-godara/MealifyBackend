
const { Decimal128, Double } = require('mongodb');
const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;
const ReviewSchema=new Schema({
    HotelId:{
        type:Schema.Types.ObjectId,
        ref:'hotel',
        required:true
    },
    UserId:{
        type:Schema.Types.ObjectId,
        ref:"client",
        index:true,
        required:true,
    },
    Rating:{
        type:Number,
        required:true
    }
    ,
    Review:
        {
        type:String,
        required:true}
})
ReviewSchema.index( {
    HotelId: 1,
 } )

module.exports=Mongoose.model('review',ReviewSchema);
