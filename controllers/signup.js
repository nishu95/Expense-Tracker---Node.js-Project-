const userDataTable = require('../models/user');
const bcrypt = require('bcrypt');

exports.postSignUp = async (req, res, next) => {
    console.log("post signup controller");
    
    const  name= req.body.name;
    const  email= req.body.email;
    const  password= req.body.password;
    
    try{
        bcrypt.hash(password,10,async(err , hash)=>{
            console.log(err);
            await userDataTable.create({name,email,password:hash});
            res.status(201).json({message:'successfully created new user'});
        })
    }catch(err){
        console.log(err);
        res.status(500).json({err:"something went wrong"});
    }
}