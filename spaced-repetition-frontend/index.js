const BASE_URL = "http://localhost:3000"
const MEMORIES_URL = `${BASE_URL}/memories`
const memoryContainer = document.getElementById('memory-cards')
const newMemoryForm = document.getElementById('new-memory-form')
// const newMemoryFormSubmit = document.getElementById('new-memory-form-submit')

class Memory {
  constructor(id, title, category, strategy, startDate){
    this.id = id,
    this.title = title
    this.category = category
    this.strategy = strategy
    this.startDate = startDate
    this.recallEvents = []
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
  deleteButton.className = 'btn btn-sm btn-dark'
  deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>'

  let categoryBadge = document.createElement('span')
  categoryBadge.className = 'badge badge-pill badge-danger mr-2'
  categoryBadge.innerText = memory.category

  let strategy = document.createElement('p')
  strategy.className = 'card-text'
  strategy.innerText = memory.strategy

  let startDate = document.createElement('h6')
  startDate.className = 'card-subtitle mb-2 text-muted'
  startDate.innerText = `Started on ${memory.startDate}`

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
  memoryContainer.prepend(card)
  addDeleteEventListener(deleteButton, card, memory)

  for(const recallEvent of memory.recallEvents){
    button = makeRecallEventButton(recallEvent)
    recall_buttons.appendChild(button)
    addCompleteEventListener(button, card, recallEvent)
  }
}

function makeMemoryCards(memories){
  for(const memory of memories){
    makeMemoryCard(memory);
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

function makeRecallEventButton(recallEvent){
  let button = document.createElement('button')
  setRecallButtonClass(button, recallEvent)
  
  
  let message = `${recallEvent.scheduledDate}`
  button.innerHTML = `${setCheck(recallEvent)} ${message}`
  disableIfAfterToday(button, recallEvent)
  return button
}

function disableIfAfterToday(button, recallEvent){
  const dateAfterToday = Date.parse(recallEvent.scheduledDate) > new Date()
  button.disabled = (dateAfterToday) ? true : false
}
function setRecallButtonClass(button, recallEvent){
  button.className = `btn btn-outline-${setRecallButtonStatus(recallEvent)} recall-event-button m-1`
}

function setRecallButtonStatus(recallEvent){
  let threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
  const dateBeforeToday = Date.parse(recallEvent.scheduledDate) < threeDaysAgo
  if(recallEvent.complete){
    return 'success'
  } else if(dateBeforeToday) {
    return 'warning'
  } else {
    return 'primary'
  }
}

function setCheck(recallEvent){
  const unchecked = '<i class="fa fa-check-circle-o" aria-hidden="true"></i>'
  const checked = '<i class="fa fa-check-circle" aria-hidden="true"></i>'
  return (recallEvent.complete) ? checked : unchecked
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
    //.then(response => console.log(response.json()))
    .then(res => res.json())
    .then(json => {
      recallEvent = makeRecallEvent(json)
      button.innerHTML = makeRecallEventButton(recallEvent).innerHTML
      setRecallButtonClass(button, recallEvent)
    })
    .catch(error => console.log(error))
  })
}


function getMemories(){
  fetch(MEMORIES_URL, {mode: 'cors'})
  .then(res => res.json())
  .then(json => makeMemoryCards(makeMemories(json))) //production
  //.then(json => console.log(json)) //test 
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
  .then(memoryHash => makeMemoryCard(makeMemory(memoryHash)))
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
    //.then(response => console.log(response.json()))
    .then(card.style.display = 'none')
    .catch(error => console.log(error))
  })
}

document.addEventListener("DOMContentLoaded", () =>{
  getMemories();
})