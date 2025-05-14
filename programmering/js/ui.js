function createLineGraph(data) {
  let max = data[0];
  let min = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i] > max) max = data[i];
    if (data[i] < min) min = data[i];
  }

  let points = "";
  for (let i = 0; i < data.length; i++) {
    let x = i * 30;
    let y = 80 - ((data[i] - min) / (max - min || 1)) * 70;
    points = points + x + "," + y + " ";
  }

  let color = "#808080";
  if (data.length > 1) {
    if (data[data.length - 1] > data[0]) color = "#00FF00";
    else if (data[data.length - 1] < data[0]) color = "#FF0000";
  }

  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 300 80");
  svg.className = "line-graph";
  let polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("stroke", color);
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke-width", "2");
  svg.appendChild(polyline);
  return svg;
}

function render() {
  let root = document.getElementById("root");
  root.innerHTML = "";

  let box = document.createElement("div");
  box.id = "game-box";
  box.className = "box";

  let title = document.createElement("h2");
  title.textContent = "United States Treasury"
  box.appendChild(title);

  let status = document.createElement("p");
  status.textContent = "Week " + state.week + " | Money: $" + state.money + "M | Satisfaction: " + calcSatisfaction() + "%";
  box.appendChild(status);

  if (state.msg !== "") {
    let message = document.createElement("p");
    let strong = document.createElement("strong");
    strong.textContent = state.msg;
    strong.className = "fade-in";
    message.appendChild(strong);
    box.appendChild(message);
  }

  let regions = ["china", "eu", "russia"];
  let sectors = ["tech", "farming", "food"];
  for (let i = 0; i < regions.length; i++) {
    let reg = regions[i];
    let regDiv = document.createElement("div");
    let regTitle = document.createElement("h4");
    regTitle.textContent = reg.toUpperCase();
    regDiv.appendChild(regTitle);
    for (let j = 0; j < sectors.length; j++) {
      let sec = sectors[j];
      let label = document.createElement("label");
      label.textContent = sec + ": " + state.tariffs[reg][sec] + "%";
      let input = document.createElement("input");
      input.type = "range";
      input.min = "0";
      input.max = "100";
      input.value = state.tariffs[reg][sec];
      input.onchange = function() { updateTariff(reg, sec, this.value); };
      label.appendChild(document.createElement("br"));
      label.appendChild(input);
      regDiv.appendChild(label);
    }
    box.appendChild(regDiv);
  }

  let nextButton = document.createElement("button");
  nextButton.textContent = "Next Week";
  nextButton.onclick = nextWeek;
  box.appendChild(nextButton);

  let relationsTitle = document.createElement("h3");
  relationsTitle.textContent = "Relations";
  box.appendChild(relationsTitle);

  let relations = document.createElement("p");
  relations.textContent = "China: " + state.china + "% | Russia: " + state.russia + "% | EU: " + state.eu + "%";
  box.appendChild(relations);

  let invList = document.createElement("ul");
  for (let i = 0; i < state.portfolio.length; i++) {
    let li = document.createElement("li");
    li.textContent = state.portfolio[i].name + " (+$" + state.portfolio[i].return + "/week) ";
    let sellButton = document.createElement("button");
    sellButton.textContent = "Sell";
    sellButton.onclick = function(i) { return function() { sellInvestment(i); }; }(i);
    li.appendChild(sellButton);
    invList.appendChild(li);
  }
  box.appendChild(invList);

  let stocksTitle = document.createElement("h3");
  stocksTitle.textContent = "Stocks";
  box.appendChild(stocksTitle);

  let toggleButton = document.createElement("button");
  toggleButton.textContent = state.showHistory ? "Hide Price History" : "Show Price History";
  toggleButton.onclick = toggleHistory;
  box.appendChild(toggleButton);

  let marketList = document.createElement("ul");
  for (let i = 0; i < state.market.length; i++) {
    let li = document.createElement("li");
    li.textContent = state.market[i].name + ": $" + state.market[i].price + "M ";
    let buyButton = document.createElement("button");
    buyButton.textContent = "Buy";
    buyButton.onclick = function(i) { return function() { buyStock(state.market[i]); }; }(i);
    li.appendChild(buyButton);
    if (state.showHistory) {
      let chartDiv = document.createElement("div");
      chartDiv.className = "chart";
      chartDiv.appendChild(createLineGraph(state.market[i].history));
      li.appendChild(chartDiv);
    }
    marketList.appendChild(li);
  }
  box.appendChild(marketList);

  let ownedList = document.createElement("ul");
  for (let i = 0; i < state.ownedStocks.length; i++) {
    let li = document.createElement("li");
    li.textContent = state.ownedStocks[i].name + " ";
    let sellButton = document.createElement("button");
    sellButton.textContent = "Sell";
    sellButton.onclick = function(i) { return function() { sellStock(i); }; }(i);
    li.appendChild(sellButton);
    ownedList.appendChild(li);
  }
  box.appendChild(ownedList);

  root.appendChild(box);
}