const BASE_URL = "http://localhost:3000"
const MEMORIES_URL = `${BASE_URL}/memories`
const memoryContainer = document.getElementById('memory-cards')
const newMemoryForm = document.getElementById('new-memory-form')

class Memory {
  constructor(id, title, category, strategy, startDate){
    this.id = id,
    this.title = title
    this.category = category
    this.strategy = strategy
    this.startDate = startDate
    this.recallEvents = []
  }

  makeMemoryCard(){
    let card = document.createElement('div');
    card.className = 'card';
  
    let cardTitle = document.createElement('h4');
    cardTitle.className = 'card-title';
    cardTitle.textContent = this.title;
  
    let cardHeader = document.createElement('div');
    cardHeader.className = 'card-header text-right';
  
    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
  
    let cardFooter = document.createElement('div')
    cardFooter.className = 'card-footer'
  
    let deleteButton = document.createElement('button')
    deleteButton.className = 'btn btn-sm btn-dark'
    deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'
  
    let categoryBadge = document.createElement('span')
    categoryBadge.className = 'badge badge-pill badge-danger mr-2'
    categoryBadge.innerText = this.category
  
    let strategy = document.createElement('p')
    strategy.className = 'card-text'
    strategy.innerText = this.strategy
  
    let startDate = document.createElement('h6')
    startDate.className = 'card-subtitle mb-2 text-muted'
    startDate.innerText = `Started on ${this.startDate}`
  
    let recall_buttons = document.createElement('div')
    recall_buttons.className = 'row d-flex flex-wrap recall-buttons-container'
  
    cardHeader.appendChild(categoryBadge)
    cardHeader.appendChild(deleteButton)
    card.appendChild(cardHeader);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(startDate)
    cardBody.appendChild(strategy)
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    cardFooter.appendChild(recall_buttons);
    memoryContainer.appendChild(card)
    addDeleteEventListener(deleteButton, card, this)
  
    for(const recallEvent of this.recallEvents){
      let button = recallEvent.makeRecallEventButton()
      recall_buttons.appendChild(button)
      addCompleteEventListener(button, card, recallEvent)
    }
  }
}

class RecallEvent {
  constructor(id, memory_id, daysDistant, complete, scheduledDate){
    this.id = id
    this.memory_id = memory_id
    this.daysDistant = daysDistant
    this.complete = complete
    this.scheduledDate = scheduledDate
  }

  makeRecallEventButton(){
    let button = document.createElement('button')
    this.setRecallButtonClass(button)
    
    
    let message = `${this.scheduledDate}`
    button.innerHTML = `${this.setCheck()} ${message}`
    this.disableIfAfterToday(button)
    return button
  }

  disableIfAfterToday(button){
    const dateAfterToday = Date.parse(this.scheduledDate) > new Date()
    button.disabled = (dateAfterToday) ? true : false
  }

  setRecallButtonClass(button){
    button.className = `btn btn-outline-${this.setRecallButtonStatus()} recall-event-button m-1`
  }
  
  setRecallButtonStatus(){
    let threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const dateBeforeToday = Date.parse(this.scheduledDate) < threeDaysAgo
    if(this.complete){
      return 'success'
    } else if(dateBeforeToday) {
      return 'warning'
    } else {
      return 'primary'
    }
  }
  
  setCheck(){
    const unchecked = '<i class="fa fa-check-circle-o" aria-hidden="true"></i>'
    const checked = '<i class="fa fa-check-circle" aria-hidden="true"></i>'
    return (this.complete) ? checked : unchecked
  }
}

//MAKING MEMORIES

function makeMemory(hash){
  //This is here so that get and set methods can be employ
  memory = new Memory(hash.id, hash.title, hash.category, hash.strategy, hash.start_date)
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

function makeMemoryCards(memories){
  for(const memory of memories){
    memory.makeMemoryCard();
  }
}

//MAKING RECALL EVENTS

function makeRecallEvent(hash){
  recallEvent = new RecallEvent(hash.id, hash.memory_id, hash.daysDistant, hash.complete, hash.scheduled_date)
  return recallEvent
}

function makeRecallEvents(recallEventsHash){
  let recallEventsArray = []
  for(const hash of recallEventsHash){
    recallEventsArray.push(makeRecallEvent(hash))
  }
  return recallEventsArray
}

function addCompleteEventListener(button, card, recallEvent){
  button.addEventListener('click', () => {
    fetch(`${MEMORIES_URL}/${recallEvent.memory_id}/recall_events/${recallEvent.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(recallEvent)
    })
    .then(res => res.json())
    .then(json => {
      recallEvent = makeRecallEvent(json)
      button.innerHTML = recallEvent.makeRecallEventButton().innerHTML
      recallEvent.setRecallButtonClass(button)
    })
    .catch(error => console.log(error))
  })
}


function getMemories(){
  fetch(MEMORIES_URL, {mode: 'cors'})
  .then(res => res.json())
  .then(json => makeMemoryCards(makeMemories(json))) //production
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
  .then(memoryHash => makeMemory(memoryHash).makeMemoryCard())
  .catch(error => console.log(error))
}

newMemoryForm.addEventListener('submit', event => {
  event.preventDefault()
  let memory_data = {
    title: event.target[0].value,
    strategy: event.target[1].value,
    category: event.target[2].value
  }
  postMemory(memory_data)
  clearNewMemoryForm();
})

function clearNewMemoryForm() {
  event.target[0].value =''
  event.target[1].value =''
  event.target[2].value =''
}

function addDeleteEventListener(button, card, memory){
  button.addEventListener('click', () => {
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

const sortButton = document.getElementById('sort-memories-button')
sortButton.addEventListener('click', () => {
  fetch(MEMORIES_URL)
  .then(res => res.json())
  .then(json => {
    json.sort(function(a, b) {
      var titleA = a.title.toUpperCase(); // ignore upper and lowercase
      var titleB = b.title.toUpperCase(); // ignore upper and lowercase
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
    
      // titles must be equal
      return 0;
    });
    const memoriesSection = document.getElementById('memory-cards')
    memoriesSection.innerHTML =''
    makeMemoryCards(makeMemories(json))
  })
})

document.addEventListener("DOMContentLoaded", () =>{
  getMemories();
})