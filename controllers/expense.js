const expenseDataTable = require('../models/expense');
const UserDataTable=require('../models/user');
const sequelize = require('../util/database');

// exports.expenseGet = async (req, res, next) => {
//     console.log("inside get expense controller")
//     try{
//         // console.log("user is >>>",req.user);
//         const ispremium= req.user.ispremiumuser;
//         // console.log("is user premuium? >>>",ispremium);
//         // we can also use this
//         // const response = await req.user.getExpenses();
//         const response = await expenseDataTable.findAll({where: {userId: req.user.id}});
//         res.status(200).json({response , success:true , premiumStatus: ispremium});
//     }catch(err){
//         console.log(err)
//         res.status(500).json({success:false});
//     }
// }

const ITEMS_PER_PAGE = 5

exports.expenseGet = async (req, res, next) => {
    console.log("inside get expense controller")
    try{
        const page = parseInt(req.query.page);
        console.log("page: " + page)
        const rows = parseInt(req.query.rows);
        console.log("rows: " + rows)
        
        // console.log("user is >>>",req.user);
        const ispremium= req.user.ispremiumuser;
        // console.log("is user premuium? >>>",ispremium);
        // we can also use this
        // const response = await req.user.getExpenses();
        const totalExpenses = await expenseDataTable.count({where: {userId: req.user.id}});
        console.log("counting of expenses is >>> ", totalExpenses);

        const response = await expenseDataTable.findAll(
            {
                where: {userId: req.user.id},
                offset: (page-1) * rows,
                limit: rows
            });
        console.log("response generated in getexpense controller >>>>",response);
        res.status(200).json({
            expenses:response,
            rows:rows,
            success:true,
            premiumStatus: ispremium,
            currentPage:page,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage:Math.ceil(totalExpenses/rows),
            hasNextPage:rows * page < totalExpenses,
            hasPreviousPage: page > 1
        });
    }catch(err){
        console.log(err)
        res.status(500).json({success:false});
    }
}

exports.expensePost = async(req, res, next) => {
    const t = await sequelize.transaction();
    console.log("inside post expense controller");
    console.log({...req.body});

    const expense=req.body.expense;
    const description=req.body.description;
    const catagory=req.body.catagory;
    const userId=req.user.id; 

    if(expense == undefined || expense.length === 0){
        res.status(400).json({success: false,message:'Parameter Missing'});
    }
    
    try{
        // req.user.createExpense({expense,description,catagory})
        expenseDataTable.create({expense,description,catagory,userId},{transaction: t})
            .then(expenseData=>{
                console.log("new expense", expense);
                console.log("total expense of user before is :",req.user.totalExpense);
                const newtotalExpOfUser = Number(req.user.totalExpense) + Number(expense);
                console.log("new total expense of user after is :",newtotalExpOfUser);
                UserDataTable.update({totalExpense:newtotalExpOfUser},{where:{id:req.user.id}, transaction: t})
                    .then(async ()=>{
                        await t.commit();
                        res.status(200).json(expenseData);
                    })
                    .catch(async (err) => {
                        await t.rollback();
                        console.log("1",err);
                        return res.status(500).json({success:false,error:err});
                    })

            })
            .catch(async (err) => {
                await t.rollback();
                console.log("2",err);
                return res.status(500).json({success:false,error:err});
            })

        

    }catch(err){
        console.log("3 posting data not working",err);
        res.status(500).json({success: false});
    }
}

exports.expenseDelete = async (req,res,next) => {
    const t = await sequelize.transaction();
    console.log("inside delete controller");
    const expenseId = req.params.id;
    try{
        await expenseDataTable.destroy({where: {id: expenseId,userId: req.user.id},transaction:t})
        .then(async ()=>{
            t.commit();
            res.sendStatus(200);
        }).catch(async(err) => {
            t.rollback();
            throw new Error(err)})
        
         
    }catch(err){
        console.log(err);
        res.sendStatus(500).json({message: "Expense not deleted",success: false});
    }
}

