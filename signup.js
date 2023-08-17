const form = document.getElementById('form');
form.addEventListener('submit', signup);
const name=document.getElementById('name');
const email=document.getElementById('email');
const pass=document.getElementById('password');



async function signup(e){
    e.preventDefault();
    console.log("inside signup function");
    const object = {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value
    }
    try{
        const response = await axios.post('http://localhost:7300/user/signup',object);
        form.reset();
    }catch(err){console.log(err);}
}