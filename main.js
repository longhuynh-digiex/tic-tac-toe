const WIN_CONDITION = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

let xPositions = [];
let oPositions = [];
const deck = document.querySelector(".deck");
const xLeft = document.querySelector(".xLeft");
const xRight = document.querySelector(".xRight");
const blocks = document.querySelectorAll(".block");
const restartBtn = document.querySelector(".button");
const overlay = document.querySelector(".overlay");
const xPointInfo = document.querySelector(".x-point");
const oPointInfo = document.querySelector(".o-point");
const playerCard = document.querySelectorAll(".player-card");
const model = document.querySelector(".model");
const container = document.querySelector(".container");
const modelText = document.querySelector(".text");
const modeSelect = document.querySelector("#mode-select");
const description = document.querySelector(".description");
let isGameEnd = false;
let isXTurn = true;
let xPoint = 0;
let oPoint = 0;
let freezeClick = false;

document.addEventListener(
  "click",
  (e) => {
    if (freezeClick) {
      e.stopPropagation();
      e.preventDefault();
    }
  },
  true
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isWon = (arr) => {
  return WIN_CONDITION.some((condition) => {
    return condition.every((move) => arr.includes(move));
  });
};

const restartGame = () => {
  xPositions = [];
  oPositions = [];
  isXTurn = true;
  container.style.animation = "none";
  model.style.display = "none";
  isGameEnd = false;
  blocks.forEach((block) => {
    block.replaceChildren();
  });
};

const winnerRender = (string) => {
  if (string === "Draw") {
    description.textContent = "Draw game";
  }

  modelText.textContent = string;
  container.style.animation = "scaleFadeOut 0.5s forwards 0.5s";
  model.style.display = "flex";
  isGameEnd = true;
};

modeSelect.addEventListener("change", () => {
  xPoint = 0;
  oPoint = 0;
  xPointInfo.textContent = 0
  oPointInfo.textContent = 0
  restartGame();
});

blocks.forEach((block, index) => {
  block.addEventListener("click", async (event) => {
    if (block.hasChildNodes()) return;

    if (isXTurn) {
      const x = document.createElement("div");
      x.classList.add("x");
      x.innerHTML = `
      <div class="overlay"></div>
          <div class="xLeft"></div>
          <div class="xRight"></div>`;
      block.appendChild(x);
      x.querySelector(".overlay").style.animation = "0%";

      xPositions.push(index);

      if (isWon(xPositions)) {
        xPoint++;
        xPointInfo.textContent = xPoint;
        winnerRender("X");
      }

      isXTurn = !isXTurn;

      if (modeSelect.value === "ai" && !isGameEnd) {
        freezeClick = true;
        await sleep(1000);
        aiMove();
        freezeClick = false;
      }
    } else {
      event.target.style.padding = "0px";
      const o = document.createElement("div");
      o.classList.add("o");
      block.appendChild(o);
      oPositions.push(index);

      if (isWon(oPositions)) {
        oPoint++;
        oPointInfo.textContent = oPoint;
        winnerRender("O");
      }
      isXTurn = !isXTurn;
    }

    if (xPositions.length + oPositions.length === 9 && !isGameEnd) {
      winnerRender("Draw");
      isXTurn = !isXTurn;
    }
  });
});

const aiMove = () => {
  const availableBlocks = [...blocks].filter((block) => !block.hasChildNodes());
  const randomMove =
    availableBlocks[Math.floor(Math.random() * availableBlocks.length)];
  const index = [...blocks].indexOf(randomMove);
  if (!availableBlocks.length) return;
  const o = document.createElement("div");
  o.classList.add("o");
  randomMove.appendChild(o);
  oPositions.push(index);

  if (isWon(oPositions)) {
    oPoint++;
    oPointInfo.textContent = oPoint;
    winnerRender("o");
  }
  // console.log("git ammend");
  
  isXTurn = true;
};

restartBtn.addEventListener("click", restartGame);
