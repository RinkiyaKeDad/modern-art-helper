let cards = {
  y: 0,
  b: 1,
  r: 2,
  g: 3,
  o: 4,
};

let roundCards = [0, 0, 0, 0, 0];
let playerCards = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];
let colorMultipliers = [0, 0, 0, 0, 0];

document.getElementById("turn").addEventListener("submit", (e) => {
  e.preventDefault();
  let turn = document.getElementById("turn-details").value;
  document.getElementById("turn-details").value = "";
  addToTurnLog(turn);
  console.log(turn);
  console.log(turn.length);

  // check end round
  if (turn.length == 2) {
    console.log("round ended");

    // extract info
    let colorPlayed = turn[1];

    // update displayed game info
    let cardsOfThatColor = Number(
      document.getElementById(`${colorPlayed}-cards`).textContent
    );
    document.getElementById(`${colorPlayed}-cards`).textContent =
      cardsOfThatColor + 1;

    // get color priorities
    roundCards[cards[colorPlayed]] += 1;
    console.log("round cards", roundCards);
    let colorsWithValues = getColorValues(roundCards);
    console.log("outside function cv", colorsWithValues);
    for (let i = 0; i < 5; i++) {
      colorMultipliers[i] += colorsWithValues[i];
    }

    // do scoring
    for (let i = 0; i < 5; i++) {
      // calculate profit for player i for each color j
      let playerProfit = 0;
      for (let j = 0; j < 5; j++) {
        playerProfit += playerCards[i][j] * colorMultipliers[j];
      }
      let playerMoney = Number(
        document.getElementById(`player-${i + 1}-money`).textContent
      );
      document.getElementById(`player-${i + 1}-money`).textContent =
        playerMoney + playerProfit;
    }

    // reset round stuff
    roundCards = [0, 0, 0, 0, 0];
    playerCards = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
  } else {
    // extract info from turn
    let playerWhoSold = turn[0];
    let colorPlayed = turn[1];
    let playerWhoBought = turn[2];
    let price = Number(turn[3] + turn[4]);
    console.log(playerWhoSold, colorPlayed, playerWhoBought, price);

    // update displayed game info
    let sellerMoney = Number(
      document.getElementById(`player-${playerWhoSold}-money`).textContent
    );
    document.getElementById(`player-${playerWhoSold}-money`).textContent =
      sellerMoney + price;

    let buyerMoney = Number(
      document.getElementById(`player-${playerWhoBought}-money`).textContent
    );
    document.getElementById(`player-${playerWhoBought}-money`).textContent =
      buyerMoney - price;

    let cardsOfThatColor = Number(
      document.getElementById(`${colorPlayed}-cards`).textContent
    );
    document.getElementById(`${colorPlayed}-cards`).textContent =
      cardsOfThatColor + 1;

    // update round info
    roundCards[cards[colorPlayed]] += 1;
    playerCards[Number(playerWhoBought) - 1][cards[colorPlayed]] += 1;
    // console.log("turn info start");
    // console.log(roundCards);
    // console.log(playerCards);
    // console.log("turn info end");
  }
});

function getColorValues(colors) {
  let colorValues = [0, 0, 0, 0, 0];

  let colorWithIndex = colors.map((count, index) => ({ index, count }));

  colorWithIndex.sort((a, b) => {
    if (a.count === b.count) {
      // return one with lower index (higher color priority)
      return a.index - b.index;
    }
    // return one with higher count
    return b.count - a.count;
  });

  if (colorWithIndex[0].count > 0) colorValues[colorWithIndex[0].index] = 30;
  if (colorWithIndex[1].count > 0) colorValues[colorWithIndex[1].index] = 20;
  if (colorWithIndex[2].count > 0) colorValues[colorWithIndex[2].index] = 10;

  console.log("in function cv", colorValues);

  return colorValues;
}

function addToTurnLog(turnDetails) {
  let listItem = document.createElement("li");
  let formattedTurnDetails = "";
  if (turnDetails.length == 2) {
    formattedTurnDetails = turnDetails[0] + " " + turnDetails[1] + " ROUND END";
  } else {
    formattedTurnDetails =
      turnDetails[0] +
      " " +
      turnDetails[1] +
      " " +
      turnDetails[2] +
      " " +
      turnDetails[3] +
      turnDetails[4];
  }
  listItem.appendChild(document.createTextNode(formattedTurnDetails));
  document.getElementById("event-list").appendChild(listItem);
}
