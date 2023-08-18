const expenseDataTable = require('../models/expense');

exports.expenseGet = async (req, res, next) => {
    console.log("inside get expense controller")
    try{
        const response = await expenseDataTable.findAll();
        res.json(response);
    }catch(err){console.log(err)}
}

exports.expensePost = async(req, res, next) => {
    console.log("inside post expense controller");
    console.log({...req.body});
    try{
        const newExpense = await expenseDataTable.create({...req.body});
        res.json(newExpense);

    }catch(err){console.log(err);}
}

exports.expenseDelete = async (req,res,next) => {
    console.log("inside delete controller");
    const expenseId = req.params.id;
    try{
        const expenseToDelete = await expenseDataTable.findByPk(expenseId);
        expenseToDelete.destroy();
        res.sendStatus(200).json({message: "Expense deleted"}); 
    }catch(err){console.log(err);}
}

