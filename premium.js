const expenseDataTable = require('../models/expense');
const userDataTable = require('../models/user');
const sequelize = require('../util/database');

exports.showleaderboard = async (req, res, next) => {
    try{
        const aggregatedUsersExpense= await userDataTable.findAll({
            attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.expense')), 'totalExpense']],             // attributes work like (select in sql)
            include:[
                {
                    model:expenseDataTable,
                    attributes:[]
                }
            ],
            group:['id'],
            order:[['totalExpense','DESC']]
        });
        
        
        
        res.status(200).json(aggregatedUsersExpense);


    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message: err.message});
    }
}