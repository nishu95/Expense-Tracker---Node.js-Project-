const form = document.getElementById('form');
form.addEventListener('submit', login);
const name=document.getElementById('name');
const email=document.getElementById('email');
const pass=document.getElementById('password');



async function login(e){
    e.preventDefault();
    console.log("inside login function");
    const object = {
        email:e.target.email.value,
        password:e.target.password.value
    }
    try{
        const response = await axios.post('http://localhost:7300/login',object);
        form.reset();
    }catch(err){
        console.log(err);
        const error = document.createElement('p');
        error.appendChild(document.createTextNode('USER ALREADY EXISTS'));
        form.appendChild(error);
    }
}