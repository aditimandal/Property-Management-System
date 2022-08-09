let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let addModal = true;

let taskAreaCont1 = document.querySelector(".textarea-cont1");
let taskAreaCont2 = document.querySelector(".textarea-cont2");
let taskAreaCont3 = document.querySelector(".textarea-cont3");
let mainCont = document.querySelector(".main-cont")

let removeBtn = document.querySelector(".remove-btn");
let removeFlag = false;

let IncBtn = document.querySelector(".increasing");
// let DecBtn=document.querySelector(".decreasing");

let allTickets = document.querySelectorAll(".ticket-cont");

let submitBtn = document.querySelector(".Submit-btn");

var uid = new ShortUniqueId();

let ticketArr = [];

if (localStorage.getItem("tickets")) {
    let str = localStorage.getItem("tickets");
    let arr = JSON.parse(str);
    ticketArr = arr;
    for (let i = 0; i < arr.length; i++) {
        let ticketObj = arr[i];
        createTicket(ticketObj.name, ticketObj.description, ticketObj.size, ticketObj.id);
    }
}

addBtn.addEventListener("click", function () {
    if (addModal) {
        modalCont.style.display = "flex";
    }
    else {
        modalCont.style.display = "none";
    }
    addModal = !addModal;

})

//submit button click
submitBtn.addEventListener("click", function () {

    createTicket(taskAreaCont1.value, taskAreaCont2.value, taskAreaCont3.value);
    taskAreaCont1.value = "";
    taskAreaCont2.value = "";
    taskAreaCont3.value = "";
    modalCont.style.display = "none";
    addModal = !addModal;

})


//creating ticket
function createTicket(name, description, size, ticketId) {
    let id;
    if (ticketId == undefined) {
        id = uid();
    } else {
        id = ticketId;
    }


    let ticketCont = document.createElement("div");
    ticketCont.setAttribute('class', 'ticket-cont');
    ticketCont.innerHTML = `<div class="holder-id">#${id}</div>
    <div class="Property-name">Name:${name}</div>
    <div class="Property-Description">Description:${description}</div>
    <div class="Property-size">Size:${size}</div>
    <button class="edit  active">Edit</button>`

    mainCont.appendChild(ticketCont);

    //edit handling
    let EditBtn = ticketCont.querySelector(".edit");

    let PropertyName = ticketCont.querySelector(".Property-name");
    let PropertyDescription = ticketCont.querySelector(".Property-Description");
    let PropertySize = ticketCont.querySelector(".Property-size");

    EditBtn.addEventListener("click", function () {
        if (EditBtn.classList.contains("active")) {
            EditBtn.style.color = 'red';
            EditBtn.classList.remove("active");

            PropertyName.setAttribute("contenteditable", "true");
            PropertyDescription.setAttribute("contenteditable", "true");
            PropertySize.setAttribute("contenteditable", "true");
        } else {
            EditBtn.classList.add("active");
            EditBtn.style.color = 'black';

            PropertyName.setAttribute("contenteditable", "false");
            PropertyDescription.setAttribute("contenteditable", "false");
            PropertySize.setAttribute("contenteditable", "false");


        }
        //update editing in ticketArr
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].name = PropertyName.textContent;
        ticketArr[ticketIdx].description=description.textContent;
        ticketArr[ticketIdx].size=size.textContent;
        updateLocalStorage();
    })


    //handling remove

    ticketCont.addEventListener("click", function () {
        if (removeFlag) {
            ticketCont.remove();
        }
        //delete from ticketArr
        let ticketIdx = getTicketIdx(id);
        ticketArr.splice(ticketIdx, 1);
        updateLocalStorage();




    })
    if (ticketId == undefined) 
        ticketArr.push({ "name": name, "description": description, "size": size, "id": id })
    // console.log(ticketArr);
    updateLocalStorage();
    



}

//handling remove in UI
removeBtn.addEventListener("click", function (e) {
    if (removeFlag) {
        removeBtn.style.color = 'black';
    }
    else {
        removeBtn.style.color = 'red'
    }
    removeFlag = !removeFlag;
})





//sorting functionality

let desc = false;
IncBtn.addEventListener("click", () => {
    let Arr = sort_array_by(ticketArr, 'size', desc);
    let allTickets = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTickets.length; j++) {
        allTickets[j].remove();
    }
    for (let i = 0; i < Arr.length; i++) {
        let ticket = Arr[i];
        let name = ticket.name;
        let description = ticket.description;
        let size = ticket.size;
        let id = ticket.id;
        createTicket(name, description, size, id)
    }
    desc = !desc;
    updateLocalStorage();

});

function sort_array_by(Arr, size, desc) {
    Arr.sort(function (a, b) {
        // if(a[size]< b[size])return -1;
        // if(a[size]> b[size])return 1;
        // return 0;
        return a.size - b.size;
    });
    if (desc) Arr.reverse();
    return Arr;

}


function getTicketIdx(id) {
    for (let i = 0; i < ticketArr.length; i++) {
        if (ticketArr[i].id == id) {
            return i;
        }
    }
}


function updateLocalStorage(){
    let stringifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets", stringifyArr);
}