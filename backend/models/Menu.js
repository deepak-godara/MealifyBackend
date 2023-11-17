const Mongoose=require('mongoose');
const Schema=Mongoose.Schema;
const itemSchema=new Schema({
    Name:{
        type:String,
        required:true
    },
    Price:{
        type:Number,
        required:true
    }
    , 
  FoodType:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    }
})
const MenuSchema =new Schema({
    Name:{
        type:String,
        required:true
    },
    items:[itemSchema]
})
const MenuSchemas= new Schema({
    Id:{
        type:Schema.Types.ObjectId,
        ref:'hotel',
        required:true
    },
    Menu:[
MenuSchema
    ]
})
MenuSchemas.methods.addDish= async function(dish){

    console.log('sdvnjsvsvns');
     const check= await this.Menu.findIndex(item=>{
        return item.Name===dish.foodcategory;
     })
     console.log(check);
        const  MenuData=[...this.Menu];
    if(check!==-1)
    {
        MenuData[check].items.push({Name:dish.name,Price:dish.price,FoodType:dish.foodtype,Description:dish.fooddescription});
    }
    else
    {
        const NewFoodCategory=[];
        console.log(dish);
        NewFoodCategory.push({Name:dish.name,Price:dish.price,FoodType:dish.foodtype,Description:dish.fooddescription})
        console.log(MenuData);
        console.log('Before pushing to MenuData:', MenuData);
        MenuData.push({
            Name: dish.foodcategory,
            items: NewFoodCategory
        });
        console.log('After pushing to MenuData:', MenuData[0]);
       
    }
   
    this.Menu=MenuData;
    console.log(MenuData);
    console.log('svnnvsin');
    return this.save();
}
module.exports=Mongoose.model('Menu',MenuSchemas);
