const path = require('path');
const fs = require('fs');
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
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const forgetPasswordRequest = require('./models/ForgotPasswordRequests')
const download = require('./models/download')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags: 'a'});

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream: accessLogStream}));
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

User.hasMany(forgetPasswordRequest);
forgetPasswordRequest.belongsTo(User);

User.hasMany(download);
download.belongsTo(User);

sequelize
    //.sync({force:true})
    .sync()
    .then(()=>{
        console.log("table has been created");
        app.listen(7300);
    })
    .catch(err=>{console.log(err)})