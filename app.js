const express = require('express');
const app=express();

const sequelize = require('./util/database');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const expenseRoute = require('./routes/expense');
const purchaseRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premium');
const forgetPasswordRoute = require('./routes/forgetpassword');

const cors = require('cors')
const bodyParser = require('body-parser');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json({extended:false}));
app.use(signupRoute);
app.use(loginRoute);
app.use(expenseRoute);
app.use(purchaseRoute);
app.use(premiumRoute);
app.use(forgetPasswordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);



sequelize
    //.sync({force:true})
    .sync()
    .then(()=>{
        console.log("table has been created");
        app.listen(7300);
    })
    .catch(err=>{console.log(err)})