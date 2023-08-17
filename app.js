const express = require('express');
const app=express();
const sequelize = require('./models/user');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(signupRoute);
app.use(loginRoute);

sequelize
    //.sync({force:true})
    .sync()
    .then(()=>{
        console.log("table has been created");
        app.listen(7300);
    })
    .catch(err=>{console.log(err)})