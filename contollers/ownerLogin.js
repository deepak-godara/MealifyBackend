const OwnerLogin = require('../models/owner');

exports.postLogin = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        // Check if username already exists
        const existingUser = await OwnerLogin.findOne({ UserName: username });
        if (existingUser) {
            return res.json({ status: '202', message: 'Username already in use' });
        }

        // Create new owner instance
        const owner = new OwnerLogin({
            UserName: username,
            Password: password,
            Email: email,
        });

        // Save the owner
        const result = await owner.save();
        res.json({ status: '200', message: 'Successfully registered' });
    } catch (err) {
        console.error('Error in registration:', err);
        res.status(500).json({ status: '500', message: 'Failed to register owner' });
    }
};

exports.getLogined = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        // Find user by username
        const user = await OwnerLogin.findOne({ UserName: username });
        if (!user) {
            return res.status(202).json({ message: 'Username is Incorrect', status: '202' });
        }

        // Check email and password
        if (user.Email !== email && user.Password !== password) {
            return res.status(202).json({ message: 'Email and Password are Incorrect', status: '202' });
        } else if (user.Email !== email) {
            return res.status(202).json({ message: 'Email is Incorrect', status: '202' });
        } else if (user.Password !== password) {
            return res.status(202).json({ message: 'Password is Incorrect', status: '202' });
        }

        // If all credentials are correct
        res.status(200).json({ status: '200', user: user, message: 'Successfully logged in' });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ status: '500', message: 'Failed to log in' });
    }
};

exports.GetOwner=async(req,res,next)=>{
    try{
    const Id=req.params.Id;
    console.log(Id)
    const Owner= await OwnerLogin.findOne({_id:Id});
    if(Owner)
    {
        res.status(200).json({message:"owner found",Data:Owner});
    }
    else
    {
        res.status(500).json({message:"owner not found"});
    }
}
catch(err){
    res.status(500).json({message:"erro in finding found"});
}

}