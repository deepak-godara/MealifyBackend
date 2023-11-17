const { default: mongoose } = require('mongoose');
const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;
const OwnerSchema= new Schema({
    UserName:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('owner',OwnerSchema);