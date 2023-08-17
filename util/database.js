const Sequelize = require('sequelize');

const  sequelize = new Sequelize('expense_tracker_nodejs_project','root','admin',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;