"use strict"
const inputToDo = document.getElementById('inputToDo');
const addButton = document.getElementById('addButton');
const allLiItems = document.getElementById('all-items');
const deleteAllButton = document.getElementById('deletAllButton');

let allItemsArray = getTodoList();
updateTodoList(allItemsArray);


addButton.addEventListener('click', () => {
  addItem();
});

document.addEventListener ('keydown', event => {
  if (event.code === 'Enter') {
    addItem();
  }
});

function addItem(){
  const todoText = inputToDo.value.trim();

  if(todoText.length > 0){
    inputToDo.classList.remove('attention');
    const todoObj = {
      text: todoText,
      isChecked: false
    }
    allItemsArray.unshift(todoObj);
    
    updateTodoList();
    saveTodoList();
    inputToDo.value = "";
  } else {
    inputToDo.classList.add('attention');
  }
}

function updateTodoList(){
  allLiItems.innerHTML = "";
  allItemsArray.forEach((arrElement, index) =>{
    createList(arrElement, index);
  })
  setCheckedInput();
}
deleteAllButton.addEventListener('click', clearAll);

function clearAll(){
  allLiItems.innerHTML = "";
  allItemsArray.length = 0;
  localStorage.clear();
}

document.addEventListener('click', (e) =>{
  const targetElement = e.target;
  const indexId = Number(targetElement.parentNode.id);
  const element = targetElement.parentNode;
   
  removeAllFocused();
  addEditButton();
 
  element.classList.add('focused');
  
  if (targetElement.closest('.list__delete-button')) {
    removeLastEdit();
    deleteThisElement(indexId);
  } else if (targetElement.closest('.list__label')) {
    const  checkBoxInput = element.querySelector('.list__input');

    checkBoxInput.addEventListener('change', () =>{
      removeLastEdit(); 
      allItemsArray[indexId].isChecked = checkBoxInput.checked;
      saveTodoList();
      updateTodoList();
    })
  } else if (targetElement.closest('.list__edit-button')){
    removeLastEdit();
    editThisElemen(element);
  } else if (targetElement.closest('.list__save')){
    saveThisElement(indexId, element);
  } else {
    noFocused();
  } 
});

function createList(arrElement, index){
  const tameplate = ` <li id="${index}" class="list__item">
                        <input id="list-${index}" class="list__input " type="checkbox" tabindex="${index+3}" >
                        <label for="list-${index}"class="list__label" ></label>
                        <div class="list__text" contenteditable="false">${arrElement.text}</div> 
                        <button class="list__edit-button "></button>
                        <button class="list__delete-button visible"></button>
                        <button class="list__save "> </button>
                    </li>`
      
  allLiItems.insertAdjacentHTML("beforeend",tameplate);
}

function setCheckedInput(){
  const editButtons = allLiItems.querySelectorAll('.list__edit-button');
  let checkboxList = allLiItems.querySelectorAll('.list__input'); 
 
  for(let i = 0; i < allItemsArray.length; i++){
    checkboxList[i].checked = allItemsArray[i].isChecked;
     if(!allItemsArray[i].isChecked) {
      editButtons[i].classList.add('visible');
    }  
   }
}

function addEditButton(){
  const editButtons = allLiItems.querySelectorAll('.list__edit-button');

  for(let i = 0; i < allItemsArray.length; i++){
    if(!allItemsArray[i].isChecked) {
      editButtons[i].classList.add('visible');
    }  
  }
}

function setThisChecked(element){
  const  editButton = element.querySelector('.list__edit-button');
  const textField = element.querySelector('.list__text');
  const  checkBoxInput = element.querySelector('.list__input');

  element.classList.remove('focused');
  if(checkBoxInput && checkBoxInput.checked){
    editButton.classList.remove('visible');
    textField.setAttribute('contenteditable', 'false'); 
  } 
}

function noFocused(){
  const liLists = allLiItems.querySelectorAll('.list__item');
   
  for(let i = 0; i < liLists.length; i++){
    if(!liLists[i].classList.contains('focused')) {
      liLists[i].querySelector('.list__text').innerText =  allItemsArray[i].text;
    } 
  }
}

function removeAllFocused(){
  const liLists = allLiItems.getElementsByClassName('list__item');
 
  for(let i = 0; i < liLists.length; i++){
    liLists[i].classList.remove('focused');
    removeEditStatus(liLists[i]);
  }
}

function removeLastEdit(){
  const liLists = allLiItems.getElementsByClassName('list__item');
 
  for(let i = 0; i < liLists.length; i++){
   liLists[i].querySelector('.list__text').innerText =  allItemsArray[i].text;
  }
}

function deleteThisElement(indexElem){
  allItemsArray = allItemsArray.filter((_, i) => i !== indexElem);
  saveTodoList();
  updateTodoList();
}

function saveTodoList(){
  const todoJson = JSON.stringify(allItemsArray);
  localStorage.setItem("todolist", todoJson);
}

function getTodoList(){
  const todoList = localStorage.getItem("todolist") || "[]";
  return JSON.parse(todoList);
}

function editThisElemen(element){
  const textToDo = element.querySelector('.list__text');
  const pos = textToDo.innerText.length;
  
  setEditStatus(element);
  setPosition(textToDo,pos);
}

function setEditStatus(element){
  const saveMark = element.querySelector('.list__save');
  const textToDo = element.querySelector('.list__text');
  const editButton = element.querySelector('.list__edit-button');
  const deleteButton = element.querySelector('.list__delete-button');
   
  textToDo.setAttribute('contenteditable', 'true'); 
  deleteButton.classList.remove('visible');
  editButton.classList.remove('visible');
  saveMark.classList.add('visible');
  textToDo.classList.add('edit');
}

function setPosition(text,pos){
  let setpos = document.createRange();
  let set = window.getSelection();
  
  setpos.setStart(text.childNodes[0], pos);
  setpos.collapse(true);
  set.removeAllRanges();
  set.addRange(setpos);
  text.focus();
}

function removeEditStatus(element){
  const saveMark = element.querySelector('.list__save');
  const textToDo = element.querySelector('.list__text');
  const  deleteButton = element.querySelector('.list__delete-button');

  textToDo.setAttribute('contenteditable', 'false'); 
  deleteButton.classList.add('visible');
  saveMark.classList.remove('visible');
  textToDo.classList.remove('edit');
}

function  saveThisElement(indexId, element){
  const textToDo = element.querySelector('.list__text');

  removeEditStatus(element);

  if(element){
    if(element.classList.contains('focused')){
    let newText = textToDo.innerText.trim();
  
    if (newText === "" || newText === null){ 
      deleteThisElement(indexId);
    } else {
      allItemsArray[indexId].text = newText;
    }
     saveTodoList(); 
  } 
 }

 updateTodoList();
}


