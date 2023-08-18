const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req,res,next) =>{
    try{
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token,'3256esdr9879875621312fvbrgrhrfv31154evegtge1');
        console.log('userid >>>>>>',user.userId);
        User.findByPk(user.userId)
            .then(user => {
                // console.log(JSON.stringify(user));
                req.user = user;
                next();
            })
            .catch(err => {throw new Error(err)});

    }catch(err){
        console.log(err);
        return res.status(401).json({success:false});
    }
}

module.exports = {
    authenticate
}