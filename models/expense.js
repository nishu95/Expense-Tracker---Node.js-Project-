const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const expenseTable = sequelize.define('expenses',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    expense:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    catagory:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = expenseTable;