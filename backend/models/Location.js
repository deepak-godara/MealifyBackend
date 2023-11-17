const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;

const LocationSchema =new Schema({
    Location:{
        type:String,
        required:true},
    Hotels:[
        {
            Longitude: {
                type: Mongoose.Schema.Types.Decimal128,
                required: true
            },
            Latitude: { // Fix the property name here
                type: Mongoose.Schema.Types.Decimal128,
                required: true
            },
            HotelId:{
                type:Schema.Types.ObjectId,
                ref:'hotel',
                required:true
            }
        }
        ]

    }
);
LocationSchema.index({ 'Hotels.Latitude': '2dsphere', 'Hotels.Longitude': '2dsphere' });
module.exports=Mongoose.model('location',LocationSchema);