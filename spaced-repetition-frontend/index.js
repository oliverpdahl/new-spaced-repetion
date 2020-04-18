const BASE_URL = "http://localhost:3000"
const MEMORIES_URL = `${BASE_URL}/memories`
const memoryContainer = document.getElementById('memory-cards')
const newMemoryForm = document.getElementById('new-memory-form')
// const newMemoryFormSubmit = document.getElementById('new-memory-form-submit')

class Memory {
  constructor(id, title){
    this.id = id,
    this.title = title
    this._recallEvents = []
  }
  get recallEvents(){
    return this._recallEvents
  }
  set recallEvents(recallEventsArray){
    this._recallEvents = recallEventsArray
  }
}

class RecallEvent {
  constructor(id, memory_id){
    this.id = id
    this.memory_id = memory_id
  }
}

//MAKING MEMORIES

function makeMemory(hash){
  //This is here so that get and set methods can be employ
  memory = new Memory(hash.id, hash.title)
  memory.recallEvents = makeRecallEvents(hash.recall_events)
  return memory
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

  let cardTitle = document.createElement('h4');
  cardTitle.className = 'card-title';
  cardTitle.textContent = memory.title;

  let cardHeader = document.createElement('div');
  cardHeader.className = 'card-header text-right';

  let cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  let cardFooter = document.createElement('div')
  cardFooter.className = 'card-footer'

  let deleteButton = document.createElement('button')
  deleteButton.className = 'btn btn-sm btn-danger'
  deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'

  let recall_buttons = document.createElement('div')
  recall_buttons.className = 'row-fluid recall-buttons-container'

  for(const recallEvent in memory.recallEvents){
    recall_buttons.appendChild(makeRecallEventButton(recallEvent))
  }

  cardHeader.appendChild(deleteButton)
  card.appendChild(cardHeader);
  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);
  cardFooter.appendChild(recall_buttons);
  memoryContainer.prepend(card)
  addDeleteEventListener(deleteButton, card, memory)
}

function makeMemoryCards(memories){
  for(const memory of memories){
    makeMemoryCard(memory);
  }
}

//MAKING RECALL EVENTS

function makeRecallEvent(hash){
  return new RecallEvent(hash.id, hash.memory_id)
}

function makeRecallEvents(recallEventsHash){
  let recallEventsArray = []
  for(const hash in recallEventsHash){
    recallEventsArray.push(makeRecallEvent(hash))
  }
  return recallEventsArray
}

function makeRecallEventButton(recallEvent){
  let button = document.createElement('button')
  button.class = 'recall-event-button btn btn-secondary span3'
  button.textContent = `${recallEvent.id} memory: ${recallEvent.memory_id}`
  return button
}

function getMemories(){
  fetch(MEMORIES_URL, {mode: 'cors'})
  .then(res => res.json())
  .then(json => makeMemoryCards(makeMemories(json))) //production
  .then(json => console.log(json)) //test 
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

function addDeleteEventListener(button, card, memory){
  button.addEventListener('click', event => {
    fetch(`${MEMORIES_URL}/${memory.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(memory)
    })
    .then(card.style.display = 'none')
    .catch(error => console.log(error))
  })
}

document.addEventListener("DOMContentLoaded", () =>{
  getMemories();
})