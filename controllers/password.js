const Sib = require('sib-api-v3-sdk');
require('dotenv').config();    

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender =  {
    email:'nitishrock26@gmail.com',
    name:'NITISH PANWAR'
}

exports.forgetPassword = async(req, res, next) => {
    try{
        console.log('inside Forget Password controller');
        console.log("req body is", req.body);
        const receivers = [
            {
                email:`${req.body.email}`
            }
        ]
        
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject:'forget password initiation',
            textContent:'nitish sends his regards'
        })
            
    }catch(err){
        console.log("inside catch controller error ");
        console.log(err);
    }
}


