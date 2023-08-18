const express = require('express');
const app=express();
const sequelize = require('./util/database');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const expenseRoute = require('./routes/expense');
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(signupRoute);
app.use(loginRoute);
app.use(expenseRoute);

sequelize
    //.sync({force:true})
    .sync()
    .then(()=>{
        console.log("table has been created");
        app.listen(7300);
    })
    .catch(err=>{console.log(err)})