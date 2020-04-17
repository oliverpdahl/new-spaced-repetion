const BASE_URL = "http://localhost:3000"
const MEMORIES_URL = `${BASE_URL}/memories`
const MEMORY_CONTAINER = document.getElementById('memory-cards')

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
  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);
  MEMORY_CONTAINER.appendChild(card)
}

function makeMemoryCards(memories){
  for(const memory in memory){
    makeMemoryCard(memory)
  }
}

function getMemories(){
  fetch(MEMORIES_URL, {mode: 'cors'})
  .then(function(response){
    return response.json();
  })
  .then(function(json){
    memories = makeMemories(json)
    makeMemoryCard(memories[0])
  })
  .catch(function(error){
    console.log(error)
  })
}

document.addEventListener("DOMContentLoaded", () =>{
  getMemories();
})