const expenseDataTable = require('../models/expense');
const userDataTable = require('../models/user');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');
const download = require('../models/download');

exports.showleaderboard = async (req, res, next) => {
    try{
        const aggregatedUsersExpense= await userDataTable.findAll({
            // attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.expense')), 'totalExpense']],             // attributes work like (select in sql)
            // include:[
            //     {
            //         model:expenseDataTable,
            //         attributes:[]
            //     }
            // ],
            // group:['id'],     // user table's 'id' column
            order:[['totalExpense','DESC']]
        });
        
        
        
        res.status(200).json(aggregatedUsersExpense);


    }catch(err){
        console.log(err);
        res.status(500).json({success:false,message: err.message});
    }
}




exports.downloadExpenseReport = async (req,res,next) =>{
    try{
        console.log("inside downloadExpenseReport controller");
        const expenses = await UserServices.getExpenses(req);      // sequelize method in services done indirectly
        console.log(expenses);
        const srtingifiedExpenses = JSON.stringify(expenses);
        console.log(srtingifiedExpenses);

        // depending on userid we will name our expense file to download 
        const userId= req.user.id;
        const filename = `Expense_${userId}/${new Date()}.txt`;

        const fileURL = await S3Services.uploadToS3(srtingifiedExpenses,filename);

        // adding file in downloadedfiles databases
        await UserServices.createDownload(fileURL,req);

        res.status(200).json({fileURL,success:true})

    }catch(err){
        console.log(err);
        res.status(500).json({fileURL: '', success: false, err:err})
    }
    
}