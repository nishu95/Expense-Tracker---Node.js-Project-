const userDataTable = require('../models/user');

exports.postSignUp = async (req, res, next) => {
    console.log("post signup controller");
    const userData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    try{
        const response = await userDataTable.create({...req.body});
        res.status(201).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"something went wrong"});
    }
}