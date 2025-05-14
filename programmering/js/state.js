let INVESTMENTS = {
  Property: { cost: 500, return: 60 },
  Tech: { cost: 1000, return: 90 },
  Energy: { cost: 750, return: 70 }
};

let INITIAL_STOCKS = [
  { name: "Index", price: 100, vol: 40, history: [100] },
  { name: "Pension", price: 80, vol: 12, history: [80] },
  { name: "Estate", price: 120, vol: 30, history: [120] },
  { name: "Defense", price: 150, vol: 35, history: [150] }
];

let state = {
  week: 1,
  money: 1000,
  tariffs: {
    china: { tech: 25, farming: 20, food: 15 },
    eu: { tech: 15, farming: 10, food: 12 },
    russia: { tech: 30, farming: 25, food: 20 }
  },
  china: 75,
  russia: 50,
  eu: 90,
  portfolio: [],
  market: INITIAL_STOCKS,
  ownedStocks: [],
  msg: "",
  showHistory: false
};