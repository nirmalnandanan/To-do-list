const form = document.querySelector(".formcontainer");
const alert = document.querySelector(".alert");
const input = document.getElementById("input");
const inputBtn = document.querySelector(".inputBtn");
const listcontainer = document.querySelector(".listcontainer");
const contain = document.querySelector(".contain");
const list = document.querySelector(".list");
const checkBox = document.querySelector(".checkBox");
const clearbtn = document.querySelector(".clearBtn");

let editElement;
let editFlag = false;
let editID = "";



inputBtn.addEventListener('click',addItem);
clearbtn.addEventListener('click', clearitems);
window.addEventListener('DOMContentLoaded', setupitems);


function addItem(e){
    e.preventDefault();
    const value = input.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag){
        createListItem(id,value);
            displayAlert('item added to the list', "okay");
            listcontainer.classList.add("showcontainer");
            addToLocalStorage(id, value);

            setbacktodefault();

    }
    else if (value && editFlag){
        editElement.innerHTML = value;
        displayAlert("value changed", "okay");
        editLocalStorage(editID, value);
        //last
        setbacktodefault();
    }
    else {
        displayAlert("please enter a value","notokay");
    }
};


function displayAlert (text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`); 

    setTimeout(function(){
        alert.textContent = "";
        alert.classList.add(`alert-${action}`); 
    },1000);


};

function clearitems (){
    const items = document.querySelectorAll('.list');

    if (items.length > 0){
        items.forEach(function(item){
            contain.removeChild(item);
        })
    }
    listcontainer.classList.remove("showcontainer");
    displayAlert("list emptied","okay");
    setbacktodefault();
    localStorage.removeItem("list");


};


function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    contain.removeChild(element);
    if(contain.children.length === 0){
        listcontainer.classList.remove("showcontainer");
    }
    displayAlert("item removed" , "notokay");
    setbacktodefault();
    removeFromLocalStorage(id);
};

function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;

    input.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    inputBtn.textContent = "edit";
};
function linethrough(e){
    const element1 = e.currentTarget.nextElementSibling;
    console.log(element1);
    if (this.checked) {
        element1.style.textDecoration = "line-through";
      } else {
        element1.style.textDecoration = "none";
      }

};

function setbacktodefault(){
    input.value ='';
    editFlag = false;
    editID = '';
    inputBtn.textContent = "Submit";
}




function addToLocalStorage(id, value) {
    const listitem = {id:id, value:value};
    //es6 shortcut can apply
    let items = getLocalStorage();
    //can do if statmnt
    //ternary operator
    items.push(listitem);
    localStorage.setItem("list",JSON.stringify(items));
    console.log(items);
     


}

function removeFromLocalStorage (id){
    let items = getLocalStorage();

    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    });
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id , value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if (item.id === id){
            item.value = value;

        }
        return item;
    });
    localStorage.setItem("list",JSON.stringify(items));


}
function getLocalStorage(){
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")) : [];
}

//local storage 
//key value pair
function setupitems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id,item.value);

        });
        listcontainer.classList.add("showcontainer");
    }
};

function createListItem(id,value){
    const element = document.createElement('div');

        element.classList.add('list');

        const attr = document.createAttribute('data-id');
        attr.value = id;
        element.setAttributeNode(attr);
        //<input type="checkbox" class="checkBox">
        element.innerHTML = `<input type="checkbox" class="checkBox">
                            <p class="listItem">${value}</p>
                            <div class="btn-container">
                                <button type="button" class="edit-btn">
                                <i class="fas fa-edit"></i>
                                </button>
                                <button type="button" class="delete-btn">
                                <i class="fas fa-trash"></i>
                                </button>
                            </div>`;
            const deleteBtn = element.querySelector('.delete-btn');
            const editBtn = element.querySelector('.edit-btn');
            deleteBtn.addEventListener('click', deleteItem);
            editBtn.addEventListener('click', editItem);
            const checkbox = element.querySelector(".checkBox");
            checkbox.addEventListener('change', linethrough);
            
            contain.appendChild(element);
};