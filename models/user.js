const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const user = sequelize.define('users',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser: {
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    totalExpense:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
});

module.exports = user;