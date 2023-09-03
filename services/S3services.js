const AWS = require('aws-sdk');

const uploadToS3 = (data,filename) =>{
    const BUCKET_NAME = 'expensetrackingapp95';
    const IAM_USER_KEY = 'AKIAUMJT4P33GIXHYX7D';
    const IAM_USER_SECRET = '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';

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

    
    var params ={
        Bucket:BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL:'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log("something went wrong in s3 ",err);
                reject(err);
            }else{
                console.log("upload success ",s3response);
                resolve(s3response.Location);
            }
        })
    })
    
    
}

module.exports = {
    uploadToS3
}
