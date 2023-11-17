const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;
const DishSchema=new Schema({
    Name:{
        type:String,
        required:true
    }
})
module.exports=Mongoose.model('dish',DishSchema);