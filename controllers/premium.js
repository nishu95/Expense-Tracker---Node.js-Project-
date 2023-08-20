const expenseDataTable = require('../models/expense');
const userDataTable = require('../models/user');
const sequelize = require('../util/database');

exports.showleaderboard = async (req, res, next) => {
    try{
        const users= await userDataTable.findAll();
        const expenses = await expenseDataTable.findAll();
        const aggregatedExpense={};
        expenses.forEach(exp => {
            if(aggregatedExpense[exp.userId]){
                aggregatedExpense[exp.userId] = aggregatedExpense[exp.userId] + exp.expense;

            }else{
                aggregatedExpense[exp.userId] = exp.expense;
            
            }
        });
        var userLeaderBoardDetailes = [];
        users.forEach((user) => {
            userLeaderBoardDetailes.push({name:user.name,totalExpense:aggregatedExpense[user.id]});
        });

        console.log(userLeaderBoardDetailes);
        userLeaderBoardDetailes.sort((a,b) => b.totalExpense - a.totalExpense);     // decreasing order by totalExpense
        res.status(200).json(userLeaderBoardDetailes);


    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message: err.message});
    }
}