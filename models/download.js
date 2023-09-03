const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const download = sequelize.define('download',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    file:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = download;