const expenseDataTable = require('../models/expense');
const UserDataTable=require('../models/user');

exports.expenseGet = async (req, res, next) => {
    console.log("inside get expense controller")
    try{
        // console.log("user is >>>",req.user);
        const ispremium= req.user.ispremiumuser;
        // console.log("is user premuium? >>>",ispremium);
        // we can also use this
        // const response = await req.user.getExpenses();
        const response = await expenseDataTable.findAll({where: {userId: req.user.id}});
        res.status(200).json({response , success:true , premiumStatus: ispremium});
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
        expenseDataTable.create({expense,description,catagory,userId})
            .then(expenseData=>{
                console.log("new expense", expense);
                console.log("total expense of user before is :",req.user.totalExpense);
                const newtotalExpOfUser = Number(req.user.totalExpense) + Number(expense);
                console.log("new total expense of user after is :",newtotalExpOfUser);
                UserDataTable.update({totalExpense:newtotalExpOfUser},{where:{id:req.user.id}})
                    .then(()=>{
                        res.status(200).json(expenseData);
                    })
                    .catch((err) => {
                        console.log("1",err);
                        return res.status(500).json({success:false,error:err});
                    })

            })
            .catch((err) => {
                console.log("2",err);
                return res.status(500).json({success:false,error:err});
            })

        

    }catch(err){
        console.log("3 posting data not working",err);
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

