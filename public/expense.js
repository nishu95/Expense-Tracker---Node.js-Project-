const form = document.getElementById('form');
form.addEventListener('submit', addexpense);
const table = document.getElementById('table');
table.addEventListener('click',change)
const token = localStorage.getItem('token');

async function addexpense(e){
    e.preventDefault();
    console.log("inside addexpense function");
    const object = {
        expense: e.target.expense.value,
        description: e.target.description.value,
        catagory:e.target.category.value
    }
    console.log(object);
    try{
        const newData = await axios.post('http://localhost:7300/expense',object,{headers:{"Authorization":token}});
        addToTable(newData.data);
        form.reset();
    }catch(e){console.log(err)}
}

function addToTable(data){
    const tr = document.createElement('tr');
    tr.id=data.id;
    const t1 = document.createElement('td');
    t1.innerHTML=`${data.expense}`;
    const t2 = document.createElement('td');
    t2.innerHTML=`${data.description}`;
    const t3 = document.createElement('td');
    t3.innerHTML=`${data.catagory}`;
    const t4 = document.createElement('td');
    t4.innerHTML = '<button class="delete btn-sm">DELETE</button>';

    tr.appendChild(t1);
    tr.appendChild(t2);
    tr.appendChild(t3);
    tr.appendChild(t4);
    table.appendChild(tr);
}

async function change(e){
    e.preventDefault();
    console.log("inside change event");
    const tr = e.target.parentElement.parentElement;
    userId=tr.id;
    if(e.target.classList.contains('delete')){
        try{
            await axios.delete(`http://localhost:7300/delete/${userId}`,{headers:{"Authorization":token}});
            table.removeChild(tr);
            document.location.reload();
        }catch(err){console.log(err)}
    }
}

document.addEventListener('DOMContentLoaded',async ()=>{
    
    try{
        const oldDatalist = await axios.get('http://localhost:7300/expense',{headers:{"Authorization":token}});
        console.log("inside refresh",oldDatalist);
        if(oldDatalist.data.premiumStatus){
            document.getElementById("rzp-button1").style.visibility = "hidden";
            document.getElementById("message").removeAttribute("hidden");
        }
        for(let i=0;i<oldDatalist.data.response.length;i++){
            addToTable(oldDatalist.data.response[i]);
        }
    }
    catch(err){console.log(err);}
    
});

document.getElementById("rzp-button1").onclick = async function(e){
    
    const response = await axios.get('http://localhost:7300/premiumMembership',{headers:{"Authorization":token}});
    console.log("rzp button clicked and get reponse is ->>>",response);

    var options = {
        "key":response.data.key_id,  // enter the key ID generated from the dashboard
        "order_id":response.data.order.id, // for one time payment
        // this handler function will handle the success payment
        "handler": async function(response){
            await axios.post('http://localhost:7300/updatetransactionstatus',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            },{headers:{"Authorization":token}});

            alert("you are a premium user now")
            document.getElementById("rzp-button1").style.visibility = "hidden";
            document.getElementById("message").removeAttribute("hidden");
        },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',async function(response){
        console.log(response);
        alert('something went wrong with the payment')
    })
    
}

