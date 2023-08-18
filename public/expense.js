const form = document.getElementById('form');
form.addEventListener('submit', addexpense);
const table = document.getElementById('table');
table.addEventListener('click',change)

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
        const newData = await axios.post('http://localhost:7300/expense',object);
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
            await axios.delete(`http://localhost:7300/delete/${userId}`);
            table.removeChild(tr);
            document.location.reload();
        }catch(err){console.log(err)}
    }
}

document.addEventListener('DOMContentLoaded',async ()=>{
    try{
        const oldDatalist = await axios.get('http://localhost:7300/expense');
        for(let i=0;i<oldDatalist.data.length;i++){
            addToTable(oldDatalist.data[i]);
        }
    }
    catch(err){console.log(err);}
    
});