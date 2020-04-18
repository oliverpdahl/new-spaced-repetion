const BASE_URL = "http://localhost:3000"
const MEMORIES_URL = `${BASE_URL}/memories`
const memoryContainer = document.getElementById('memory-cards')
const newMemoryForm = document.getElementById('new-memory-form')
// const newMemoryFormSubmit = document.getElementById('new-memory-form-submit')

class Memory {
  constructor(title){
    this.title = title;
  }
}

function makeMemory(hash){
  //This is here so that get and set methods can be employ
  return new Memory(hash.title)
}

function makeMemories(memoryHash){
  let memoryArray = []
  for(const hash of memoryHash){
    memoryArray.push(makeMemory(hash)) 
  }
  return memoryArray
}

function makeMemoryCard(memory){
  let card = document.createElement('div');
  card.className = 'card';

  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  let cardTitle = document.createElement('h4');
  cardTitle.className = 'card-title';
  cardTitle.textContent = memory.title;

  let cardHeader = document.createElement('div');
  cardHeader.className = 'card-header text-right';

  let deleteButton = document.createElement('button')
  deleteButton.className = 'btn btn-sm btn-danger'
  deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'
  
  cardHeader.appendChild(deleteButton)
  card.appendChild(cardHeader);
  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);
  memoryContainer.prepend(card)
}

function makeMemoryCards(memories){
  for(const memory of memories){
    makeMemoryCard(memory);
  }
}

function getMemories(){
  fetch(MEMORIES_URL, {mode: 'cors'})
  .then(res => res.json())
  .then(json => makeMemoryCards(makeMemories(json))) 
  .catch(error => console.log(error))
}

function postMemory(memory_data){
  fetch(MEMORIES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(memory_data)
  })
  .then(res => res.json())
  .then(memoryHash => makeMemoryCard(memoryHash))
  .catch(error => console.log(error))
}

newMemoryForm.addEventListener('submit', event => {
  event.preventDefault()
  let memory_data = {
    title: event.target[0].value
  }
  postMemory(memory_data)
})

document.addEventListener("DOMContentLoaded", () =>{
  getMemories();
})