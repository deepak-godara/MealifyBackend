
const ownerLogin = require('../models/owner')
exports.postLogin=(req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;  
    const owner =new ownerLogin({
        UserName:username,
        Password:password,
        Email:email,
        // HotelId:null
    })
    ownerLogin.findOne({UserName:username})
    .then(user=>{
        if(user)
        {
            res.json({status:'202', message:'UserName already in use'})
        }
        else
        {
            owner.save()
            .then(result=>{
                res.json({status:'200', message:'add successfully'})
            })
            .catch(err=>{
                console.log(err);
                throw err;
            })
        }
    })
   
}
exports.getLogined=(req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email; 
    ownerLogin.findOne({UserName:username})
    .then(user=>{
        if(!user)
        {
            res.status(202).json({message:'UserName is Incorrect', status:'202'});
        }
        else
        {
            console.log(user)
            if(user.Email!==email&&user.Password!==password)
             res.status(202).json({message:'Email  and Password are Incorrect',status:'202'});
             else if(user.Email!==email)
             res.status(202).json({message:'Email is Incorrect',status:'202'});
             else if(user.Password!==password)
             res.status(202).json({message:'Password is Incorrect',status:'202'});
             else
             {
                res.status(200).json({status:'200',user:user,message:'Successfully loggined'});
             }
        }
    })
    .catch(err=>{
        throw err;
    })
}