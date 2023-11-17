const Hotel=require('../models/Hotel');
const Reviews=require('../models/Review');
exports.addReview=(req,res,next)=>{
    const id=req.params.hotelid;
    Reviews.findOne({Id:id}).
    then(product=>{})
}