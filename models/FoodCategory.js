const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;
const CategorySchema=new Schema({
    FoodCategory:{
        Name:{
            type:String,
            Required:true
        }
    }
})
module.exports=Mongoose.model('category',CategorySchema);