
const data = window.data;
const bigCoffee=document.getElementById("big_coffee")
const producerContainer=document.getElementById("producer_container")

function updateCoffeeView(coffeeQty) {
    let coffeeCounter= document.getElementById('coffee_counter');
    coffeeCounter.innerText=coffeeQty;
}

function clickCoffee(data) {
    data.coffee++;
    updateCoffeeView(data.coffee);
    renderProducers(data);

}

function unlockProducers(producers, coffeeCount) {
 producers.forEach(element=>{
    if(coffeeCount>=element.price/2){
      element.unlocked=true;
     }
  }
  )   
}

function getUnlockedProducers(data) {
  const showUnlocked=data.producers.filter(element=>element.unlocked===true)
  return showUnlocked
}

function makeDisplayNameFromId(id) {
  return id
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
    <div class="producer-column">
      <div class="producer-title">${displayName}</div>
      <button type="button" id="buy_${producer.id}">Buy</button>
    </div>
    <div class="producer-column">
      <div>Quantity: ${producer.qty}</div>
      <div>Coffee/second: ${producer.cps}</div>
      <div>Cost: ${currentCost} coffee</div>
    </div>
    `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
unlockProducers(data.producers, data.coffee);
const producerContainer = document.getElementById("producer_container");
deleteAllChildNodes(producerContainer);
  getUnlockedProducers(data).forEach((producer) => {
    producerContainer.appendChild(makeProducerDiv(producer));
  });
}

function getProducerById(data, producerId) {
  return data.producers.find((producer) => producerId === producer.id);
}

function canAffordProducer(data, producerId) {
  return getProducerById(data, producerId).price <= data.coffee;
}

function updateCPSView(cps) {
  const cpsDiv = document.getElementById("cps");
  cpsDiv.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    const producer = getProducerById(data, producerId);
    data.coffee -= producer.price;
    producer.qty += 1;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    const producerId = event.target.id.slice(4);
    const result = attemptToBuyProducer(data, producerId);
    if (!result) {
      window.alert("Not enough coffee!");
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

bigCoffee.addEventListener("click", (event)=>{clickCoffee(data)})
producerContainer.addEventListener("click", (event)=>{buyButtonClick(event, data)})

setInterval(() => tick(data), 1000);