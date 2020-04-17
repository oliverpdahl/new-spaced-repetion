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

function getMemories(){
  fetch(MEMORIES_URL, {mode: 'cors'})
  .then(function(response){
    return response.json();
  })
  .then(function(json){
    console.log(makeMemories(json))
  })
  .catch(function(error){
    console.log(error)
  })
}

document.addEventListener("DOMContentLoaded", () =>{
  getMemories();
})