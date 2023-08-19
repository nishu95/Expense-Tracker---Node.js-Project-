const userDataTable = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name},'3256esdr9879875621312fvbrgrhrfv31154evegtge1')
}

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
                    if(result === true){      // for successful login we generate token
                        console.log("User password matched")
                        res.status(200).json({success:true,message:"user logged in successfully", token:generateAccessToken(user[0].id,user[0].name)});
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

