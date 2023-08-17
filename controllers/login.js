const userDataTable = require('../models/user');
const bcrypt = require('bcrypt');

exports.loginpost = async (req, res, next) => {
    console.log("inside login post controller");
    console.log(req.body.email);
    try{
        const user = await userDataTable.findAll({where:{email:req.body.email}})
            if(user){
                console.log("User found in controller")
                console.log(req.body.password);
                console.log(user[0].password);
                bcrypt.compare(req.body.password, user[0].password,(err, result) => {
                    if(err){
                        throw new Error('something went wrong')
                    }
                    if(result === true){
                        console.log("User password matched")
                        res.status(200).json({success:true,message:"user logged in successfully"});
                    }else{
                        res.status(401).json({error:"incorrect password"});                   
                    }
                })
            }   
    }catch(err){
        console.log(err);
        res.status(404).json({success:false,error:"user did not exist"});
    }
}

