function calcSatisfaction() {
  let total = state.china + state.russia + state.eu;
  return Math.round(total / 3);
}

function calcChange(diff) {
  let sign = diff >= 0 ? 1 : -1;
  return Math.round(sign * Math.sqrt(Math.abs(diff)) * 2);
}