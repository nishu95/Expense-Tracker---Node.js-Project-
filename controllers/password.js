const UserTable = require('../models/user');
const ForgotPasswordRequestsTable = require('../models/ForgotPasswordRequests');

const uuid = require('uuid');       // Create a version 4 (random) UUID  
const bcrypt = require('bcrypt');


let mail;
let userId;

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
        mail = req.body.email;
        console.log('inside Forget Password controller');
        console.log("req body mail is >>", req.body.email);
        const receivers = [
            {
                email:`${req.body.email}`
            }
        ]
        
        const user = await UserTable.findOne({where:{email:req.body.email}})
        console.log("user is >>>",user);
        if(user){
            const id = uuid.v4();
            await ForgotPasswordRequestsTable.create({id,isactive:true,userId:user.id})
                .catch(err => {
                    console.log(err);
                    throw new Error(err)
                })
            
            await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject:'forget password initiation',
            htmlContent:`<h2>reset your password here <a href="http://localhost:7300/password/resetpassword/${id}">RESET PASSWORD</a></h2>` 
            })
            .then((response)=>{
                console.log(response);
                res.status(201).json({message:"email sent check the email now"})
            })
            .catch(err=>{
                console.log(err);
                throw new Error(err)
            })
        }else{
            throw new Error("User does not exist")
        }
            
    }catch(err){
        console.log("inside catch controller error ");
        console.log(err);
    }
}

exports.resetPassword =async (req,res,next) => {
    try{
        const id = req.params.uuid;
        console.log("inside reset password controller");
        console.log("req body is >> ",req.params);
        await ForgotPasswordRequestsTable.findOne({where:{id:req.params.uuid}})
            .then((forgetpasswordrequest)=>{
                if(forgetpasswordrequest){
                    //forgetpasswordrequest.update({isactive:false});
                    res.status(200).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Update Password</title>
            
                        <link
                        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
                        rel="stylesheet"
                        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ"
                        crossorigin="anonymous"
                        />
                        <script
                        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
                        crossorigin="anonymous"
                        ></script>
                    </head>
                    <body>
                        <div class="card">
                            <div class="card-body">
                                <div class="container text-center">
                                    <form action="/password/updatepassword/${id}" method="POST" id="form">
                                        <div class="row align-items-center">
                                            <div class="col">
                                                <label for="password">Password</label>
                                                <input type="text" id="password" name="password" placeholder="please enter NEW unique password" required>
                                            </div>
                                            <div class="col">
                                                <button type="submit" id="submit" class="btn btn-success">RESET PASSWORD</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <script>
                            const submit = document.getElementById('submit');
                            submit.addEventListener('click',resetpassword);
                            
                            async function resetpassword(e) {
                                preventDefault(e);
                                try{
                                    const npass = document.getElementById('password').value;
                                    console.log(npass)
                                    const obj = {
                                        password:npass
                                    }
                                    const res = await axios.post("http://localhost:7300/password/updatepassword/${id}",obj)
                                    console.log(res);
                                    alert(res.data.msg);
                                    window.location.href = "../public/login.html";

                                }catch(err){console.log(err)}
                            }
                        </script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/axios.min.js"></script>
                    </body>
                    </html>`)
                    res.end()
                }
            })
            .catch(err=>{
                throw new Error(err)
            })

    }
    catch(err){
        console.log("inside reset password controller error>>> ",err);
    }
}


exports.updatePassword = async function(req, res, next){
    try{
        console.log("inside update password controller");
        console.log("req body password>>",req.body.password);
        console.log("req params uuid>> ", req.params.uuid);
        const newpassword = req.body.password;
        

        await ForgotPasswordRequestsTable.findOne({where:{id:req.params.uuid}})
            .then(async (forgotentry)=>{
                
                if(forgotentry.isactive === false){
                    return res.status(201).json({message:"LINK EXPIRED"})
                }

                await UserTable.findOne({where:{id:forgotentry.userId}})
                    .then(async (user)=>{
                        const saltrounds = 10;
                        bcrypt.hash(newpassword,saltrounds,async(err,hash)=>{
                            console.log(err);
                            await user.update({password:hash})
                        })
                    })
                    .catch((err)=>{console.log(err)})

                await forgotentry.update({isactive:false})
                res.status(201).json({message:"PASSWORD UPDATED SUCCESSFULLY"})
            })
            .catch(err=>{console.log(err)})
        
        
        
    }catch(err){console.log("inside update password controller error>>> ",err)}
}