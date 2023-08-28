const form=document.getElementById("form")
form.addEventListener("submit",forget);

async function forget(e){
    e.preventDefault();
    const email={
        email:e.target.email.value
    }
    console.log("e.target.email.value is>>>>",email);
    try{
        await axios.post('http://localhost:7300/password/forgotpassword',email)
            .then(()=>{
                form.reset();
                console.log('forget password successfull');;
            })
            .catch(err => console.log(err));
        
    }catch(err){console.log(err);}
}