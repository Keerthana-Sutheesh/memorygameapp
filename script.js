const board = document.getElementById("gameBoard");
const moveCountEl = document.getElementById("moveCount");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const messageEl = document.getElementById("message");

const symbols = ["🍎", "🍋", "🍇", "🍉", "🍒", "🥝", "🍍", "🍑"];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let secondsElapsed = 0;
let timerId = null;
let gameStarted = false;

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    secondsElapsed += 1;
    timerEl.textContent = formatTime(secondsElapsed);
  }, 1000);
}


function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function updateMoves() {
  moves += 1;
  moveCountEl.textContent = String(moves);
}

function checkWin() {
  if (matchedPairs === symbols.length) {
    stopTimer();
    messageEl.textContent = `You won in ${moves} moves and ${formatTime(secondsElapsed)}!`;
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
  }, 700);
}

function matchCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  matchedPairs += 1;
  resetTurn();
  checkWin();
}

function onCardClick(event) {
  const clickedCard = event.currentTarget;

  if (lockBoard || clickedCard === firstCard || clickedCard.classList.contains("matched")) {
    return;
  }

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
    messageEl.textContent = "";
  }

  clickedCard.classList.add("flipped");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  }

  secondCard = clickedCard;
  updateMoves();

  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
  if (isMatch) {
    matchCards();
  } else {
    unflipCards();
  }
}


function createCard(symbol) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.symbol = symbol;
  card.setAttribute("aria-label", "Memory card");

  const front = document.createElement("span");
  front.className = "card-face card-front";
  front.textContent = "?";

  const back = document.createElement("span");
  back.className = "card-face card-back";
  back.textContent = symbol;

  card.append(front, back);
  card.addEventListener("click", onCardClick);

  return card;
}

function resetStats() {
  moves = 0;
  matchedPairs = 0;
  secondsElapsed = 0;
  gameStarted = false;
  moveCountEl.textContent = "0";
  timerEl.textContent = "00:00";
  messageEl.textContent = "";
  stopTimer();
  resetTurn();
}

function setupGame() {
  resetStats();
  board.innerHTML = "";

  const cardValues = shuffle([...symbols, ...symbols]);
  cardValues.forEach((symbol) => {
    board.appendChild(createCard(symbol));
  });
}

restartBtn.addEventListener("click", setupGame);

setupGame();
