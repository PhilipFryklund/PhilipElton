function nextWeek() {
  let sweetSpots = {
    china: { tech: 20, farming: 15, food: 10 },
    eu: { tech: 10, farming: 8, food: 5 },
    russia: { tech: 25, farming: 20, food: 15 }
  };

  let income = 0;
  let regions = ["china", "eu", "russia"];
  let sectors = ["tech", "farming", "food"];
  for (let i = 0; i < regions.length; i++) {
    let reg = regions[i];
    for (let j = 0; j < sectors.length; j++) {
      let sec = sectors[j];
      let diff = state.tariffs[reg][sec] - sweetSpots[reg][sec];
      income = income + diff * 10;
      if (state.tariffs[reg][sec] < sweetSpots[reg][sec]) {
        income = income - Math.abs(diff) * 10;
      }
    }
  }

  for (let i = 0; i < state.portfolio.length; i++) {
    income = income + state.portfolio[i].return;
  }
  state.money = state.money + Math.round(income - 100);

  state.china = Math.max(0, Math.min(100, state.china - calcChange(state.tariffs.china.tech - sweetSpots.china.tech)));
  state.russia = Math.max(0, Math.min(100, state.russia - calcChange(state.tariffs.russia.tech - sweetSpots.russia.tech)));
  state.eu = Math.max(0, Math.min(100, state.eu - calcChange(state.tariffs.eu.tech - sweetSpots.eu.tech)));

  let newMarket = [];
  for (let i = 0; i < state.market.length; i++) {
    let stock = state.market[i];
    let newPrice = Math.max(1, Math.round(stock.price + (Math.random() - 0.5) * stock.vol));
    let newHistory = stock.history.slice(0, 9);
    newHistory.push(newPrice);
    newMarket.push({ name: stock.name, price: newPrice, vol: stock.vol, history: newHistory });
  }
  state.market = newMarket;

  state.week = state.week + 1;
  state.msg = "Advanced to week " + state.week;
  render();
  let box = document.getElementById("game-box");
  box.className = "box flash";
  setTimeout(function() { box.className = "box"; }, 600);
}

function updateTariff(region, sector, value) {
  state.tariffs[region][sector] = Number(value);
  render();
}

function buyInvestment(name) {
  let inv = INVESTMENTS[name];
  if (state.money >= inv.cost) {
    state.money = state.money - inv.cost;
    state.portfolio.push({ name: name, cost: inv.cost, return: inv.return });
    render();
  }
}

function sellInvestment(index) {
  let inv = state.portfolio[index];
  state.money = state.money + Math.round(INVESTMENTS[inv.name].cost * 0.8);
  state.portfolio.splice(index, 1);
  render();
}

function buyStock(stock) {
  if (state.money >= stock.price) {
    state.money = state.money - stock.price;
    state.ownedStocks.push({ name: stock.name, price: stock.price, vol: stock.vol, history: stock.history });
    render();
  }
}

function sellStock(index) {
  let stock = state.ownedStocks[index];
  let price = 0;
  for (let i = 0; i < state.market.length; i++) {
    if (state.market[i].name === stock.name) {
      price = state.market[i].price;
      break;
    }
  }
  state.money = state.money + price;
  state.ownedStocks.splice(index, 1);
  render();
}

function toggleHistory() {
  state.showHistory = !state.showHistory;
  render();
}