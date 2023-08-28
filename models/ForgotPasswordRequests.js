const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const forgetPasswordRequest = sequelize.define('forgetPasswordRequests',{
    id:{
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    isactive:{
        type:Sequelize.BOOLEAN,
    }
});

module.exports = forgetPasswordRequest;