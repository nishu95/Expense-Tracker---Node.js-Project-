const userDataTable = require('../models/user');

exports.loginpost = async (req, res, next) => {
    console.log("inside login post controller");
    console.log(req.body.email);
    try{
        const user = await userDataTable.findAll({where:{email:req.body.email}})
            if(user){
                console.log("User found in controller")
                console.log(req.body.password);
                console.log(user[0].password);
                if(user[0].password === req.body.password){
                    console.log("User password matched")
                    return res.status(200).json({success:true,message:"user logged in successfully"});
                }
                else{
                    return res.status(401).json({error:"incorrect password"});                   
                }
            }   
    }catch(err){
        console.log(err);
        res.status(404).json({success:false,error:"user did not exist"});
    }
}

