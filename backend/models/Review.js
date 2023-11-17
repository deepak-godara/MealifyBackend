
const { Decimal128, Double } = require('mongodb');
const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;
const getReviewSchema=new Schema({
    Id:{
        type:Schema.Types.ObjectId,
        ref:'client',
        required:true
    },
    Review:
        {
        type:String,
        required:true}
})
const ReviewSchema=new Schema({
    Id:{
        type:Schema.Types.ObjectId,
        ref:'hotel',
        required:true
    },
    Rating:{
        type: Mongoose.Schema.Types.Decimal128,
        required:true
    },
    Count:{
        type:Number,
        required:true
    },
    Review:[
getReviewSchema
    ]
})

module.exports=Mongoose.model('review',ReviewSchema);
