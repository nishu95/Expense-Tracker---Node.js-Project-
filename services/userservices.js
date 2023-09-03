const getExpenses = (req,where) =>{
    return req.user.getExpenses();
}

const createDownload = (fileURL,req) =>{
    return req.user.createDownload({file:fileURL,userId:req.user.id})
}

module.exports = {
    getExpenses,
    createDownload
}