const expenseDataTable = require('../models/expense');

exports.expenseGet = async (req, res, next) => {
    console.log("inside get expense controller")
    try{
        // we can also use this
        // const response = await req.user.getExpenses();
        const response = await expenseDataTable.findAll({where: {userId: req.user.id}});
        res.status(200).json({response,success:true});
    }catch(err){
        console.log(err)
        res.status(500).json({success:false});
    }
}

exports.expensePost = async(req, res, next) => {
    console.log("inside post expense controller");
    console.log({...req.body});
    
    const expense=req.body.expense;
    const description=req.body.description;
    const catagory=req.body.catagory;
    const userId=req.user.id; 
    
    try{
        // req.user.createExpense({expense,description,catagory})
        const newExpense = await expenseDataTable.create({expense,description,catagory,userId});
        res.status(200).json(newExpense);

    }catch(err){
        console.log(err);
        res.status(500).json({success: false});
    }
}

exports.expenseDelete = async (req,res,next) => {
    console.log("inside delete controller");
    const expenseId = req.params.id;
    try{
        await expenseDataTable.destroy({where: {id: expenseId,userId: req.user.id}})
        .then(()=>{
            res.sendStatus(200);
        }).catch(err => {throw new Error(err)})
        
         
    }catch(err){
        console.log(err);
        res.sendStatus(500).json({message: "Expense not deleted",success: false});
    }
}

