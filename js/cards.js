let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

const container = document.querySelector(".cards-grid");
const cards = () => Array.from(document.querySelectorAll(".card"));
const timerElement = document.getElementById("timer");
const gameSection = document.getElementById("cards_game");

let timeRemaining = 60;
let timerInterval = null;

function shuffleCards() {
  if (!container) return;

  const shuffledCards = cards().sort(() => Math.random() - 0.5);
  container.innerHTML = "";
  shuffledCards.forEach((card) => container.appendChild(card));
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;
  if (this.classList.contains("is-matched")) return;

  this.classList.add("is-flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.dataset.character === secondCard.dataset.character;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add("is-matched");
  secondCard.classList.add("is-matched");

  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  matchedPairs += 1;
  onPairFound();
  resetBoard();

  if (matchedPairs === Math.floor(cards().length / 2)) {
    endGame();
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("is-flipped");
    secondCard.classList.remove("is-flipped");
    resetBoard();
  }, 800);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restartGame() {
  matchedPairs = 0;
  resetBoard();

  if (timerElement) {
    timeRemaining = 60;
    timerElement.textContent = "01:00";
    startTimer();
  }

  shuffleCards();

  cards().forEach((card) => {
    card.classList.remove("is-flipped", "is-matched");
    card.removeEventListener("click", flipCard);
    card.addEventListener("click", flipCard);
  });
}

function onPairFound() {
  if (typeof confetti !== "function") return;
  [0, 100, 200].forEach((delay) => {
    setTimeout(shoot, delay);
  });
}

const defaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
};

function shoot() {
  if (typeof confetti !== "function") return;

  confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ["star"] });
  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ["circle"],
  });
}

function startTimer() {
  if (!timerElement) return;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert("Время вышло! Попробуйте снова.");
      restartGame();
      return;
    }

    timeRemaining -= 1;
    timerElement.textContent = `${String(
      Math.floor(timeRemaining / 60),
    ).padStart(2, "0")}:${String(timeRemaining % 60).padStart(2, "0")}`;
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);

  setTimeout(() => {
    alert("Поздравляем! Вы нашли все пары!");
  }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!container) return;

  restartGame();

  if (gameSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && timerElement) {
          startTimer();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(gameSection);
  }
});
