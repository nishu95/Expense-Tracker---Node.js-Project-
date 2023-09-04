const form = document.getElementById('form');
form.addEventListener('submit', addexpense);
const table = document.getElementById('table');
table.addEventListener('click',change)
const leaderboardButton = document.getElementById('leaderboard');
leaderboardButton.addEventListener('click',showLeaderboardTable);
const download = document.getElementById('downloadreport');;
download.addEventListener('click',DownloadReport)
const token = localStorage.getItem('token');
const pagination = document.getElementById('container');
const rowsPerPage = document.getElementById('rowsPerPage');




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
    const tbody = document.getElementById('tbody')
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
    tbody.appendChild(tr);
}

function addToTable2(data){
    const tr = document.createElement('tr');
    const leadeboardTable = document.getElementById('leaderboardtable');

    const t1 = document.createElement('td');
    t1.innerHTML=`${data.name}`;
    const t2 = document.createElement('td');
    t2.innerHTML=`${data.totalExpense}`;

    tr.appendChild(t1);
    tr.appendChild(t2);
    
    leadeboardTable.appendChild(tr);
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
            window.location.reload();
            
        }catch(err){console.log(err)}
    }
}

async function showLeaderboardTable(e){
    e.preventDefault();
    console.log("inside showLeaderboardTable function ready to the leader");
    document.getElementById("p").removeAttribute("hidden");
    document.getElementById("leaderboardtable").removeAttribute("hidden");

    const response = await axios.get('http://localhost:7300/premium/showleaderboard',{headers:{"Authorization":token}});
    console.log("front end response:  ",response);
    for(let i=0;i<response.data.length;i++) {
        addToTable2(response.data[i]);
    }


}

async function DownloadReport(e){
    e.preventDefault();
    try{
        await axios.get('http://localhost:7300/premium/downloadExpenseReport',{headers:{"Authorization":token}})
            .then((response) =>{
                if(response.status === 200){
                    // the backend is essentialy sending a doenload link
                    // which is we open in browser srtars downloading
                    var a = document.createElement('a');
                    a.href= response.data.fileURL;
                    a.download = 'myexpense.csv';
                    a.click();

                }else{
                    throw new Error(response.data.message)
                }
            })
            .catch((err)=>
                showError(err)
            )
    }catch(err){
        console.log(err);
    }
}

// document.addEventListener('DOMContentLoaded',async ()=>{
    
//     try{
//         const oldDatalist = await axios.get('http://localhost:7300/expense',{headers:{"Authorization":token}});
//         console.log("inside refresh",oldDatalist);
//         if(oldDatalist.data.premiumStatus){
//             document.getElementById("rzp-button1").style.visibility = "hidden";
//             document.getElementById("message").removeAttribute("hidden");
//             document.getElementById("leaderboard").removeAttribute("hidden");
//             document.getElementById("downloadreport").removeAttribute("hidden");
//         }

//         for(let i=0;i<oldDatalist.data.response.length;i++){
//             addToTable(oldDatalist.data.response[i]);
//         }

//     }
//     catch(err){console.log(err);}
    
// });

rowsPerPage.addEventListener('change', (e)=>{
    const new_no_of_rows = e.target.value; 
    console.log("new_no_of_rows are >>>>>",new_no_of_rows);
    localStorage.setItem("rows",new_no_of_rows);
    rowsPerPage.value = new_no_of_rows;
    window.location.reload();
})

async function getExpenses(page,rows){
    try{
        await axios.get(`http://localhost:7300/expense?page=${page}&rows=${rows}`,{headers:{"Authorization":token}})
            .then(({data:{expenses , ...pageData}}) => {
                console.log("expense response inside getExpense function >>>>",expenses,"pageData response inside getExpense function >>>>",pageData);
                document.getElementById('tbody').innerHTML ="";
                for(var i=0; i<expenses.length; i++){
                    addToTable(expenses[i]);
                }
                showPagination(pageData)    
            })
            .catch(err => {throw new Error(err)})

    }catch(err){console.log(err);}
}

function showPagination(pageData){
    pagination.innerHTML = '';
    console.log("showPagination function parameters >>>>> ",pageData.rows,pageData.currentPage,pageData.nextPage,pageData.previousPage,pageData.lastPage,pageData.hasNextPage,pageData.hasPreviousPage)
    

    if(pageData.hasPreviousPage){
        const btn2 = document.createElement('button');
        btn2.innerHTML = pageData.previousPage;
        btn2.addEventListener('click',()=> getExpenses(pageData.previousPage,pageData.rows));
        pagination.appendChild(btn2);
    }

    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${pageData.currentPage}</h3>`;
    btn1.addEventListener('click',()=> getExpenses(pageData.currentPage,pageData.rows));
    pagination.appendChild(btn1);

    if(pageData.hasNextPage){
        const btn3 = document.createElement('button');
        btn3.innerHTML = pageData.nextPage;
        btn3.addEventListener('click',()=> getExpenses(pageData.nextPage,pageData.rows));
        pagination.appendChild(btn3);
    }
}

document.addEventListener('DOMContentLoaded',async ()=>{
    try{
        const objUrlParams = new URLSearchParams(window.location.search);
        const page = objUrlParams.get('page') || 1;
        const rowsPerPage = localStorage.getItem('rows') || 5;
        await axios.get(`http://localhost:7300/expense?page=${page}&rows=${rowsPerPage}`,{headers:{"Authorization":token}})
        .then(({data:{expenses , ...pageData}}) => {
            console.log("expense response inside DOMContentLoaded function >>>>",expenses,"pageData response inside DOMContentLoaded function",pageData);
            for(var i=0; i<expenses.length; i++){
                addToTable(expenses[i]);
            }
            if(pageData.premiumStatus){
                document.getElementById("rzp-button1").style.visibility = "hidden";
                document.getElementById("message").removeAttribute("hidden");
                document.getElementById("leaderboard").removeAttribute("hidden");
                document.getElementById("downloadreport").removeAttribute("hidden");
            }
            showPagination(pageData)
        })
        .catch((err) => {throw new Error(err)})

    }catch(err){console.log(err);}   
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
                clickStatus: 'payment_success'
            },{headers:{"Authorization":token}});

            alert("you are a premium user now")
            document.getElementById("rzp-button1").style.visibility = "hidden";
            document.getElementById("message").removeAttribute("hidden");
            document.getElementById("leaderboard").removeAttribute("hidden");

        },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',async function(response){
        console.log(response);
        console.log(response.error.reason);
        console.log(response.error.metadata.payment_id);
        console.log(response.error.metadata.order_id);
        await axios.post('http://localhost:7300/updatetransactionstatus',{
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
                clickStatus: 'payment_failed'
            },{headers:{"Authorization":token}});
        
        alert('something went wrong with the payment')
    })
    
}

