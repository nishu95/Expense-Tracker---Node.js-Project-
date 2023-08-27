const form = document.getElementById('form');
form.addEventListener('submit', login);
const name=document.getElementById('name');
const email=document.getElementById('email');
const pass=document.getElementById('password');
const msg = document.querySelector('.msg');


async function login(e){
    e.preventDefault();
    console.log("inside login function");
    const object = {
        email:e.target.email.value,
        password:e.target.password.value
    }
    try{
        const response = await axios.post('http://localhost:7300/login',object);

        console.log(response.status);
        if(response.status===200){
            
            alert(response.data.message);
            console.log(response.data);
            localStorage.setItem("token",response.data.token);    // we save the generated token in controller in local storage to be used later
            window.location.href = "../public/expense.html";

        }else{
            alert(response.data.message);
            console.log(response.data.message);
            document.body.innerHTML += `<div style="color:red;">${response.data.message}  <div> `
            throw new Error(response.data.message);
        }
    }catch(err){
        console.log(err);
        msg.textContent = err.response.data.error;
        setTimeout(()=>{msg.remove();},3000);
        // document.body.innerHTML += `<div style="color:red;">${response.data.message}  <div> `
    }
}

