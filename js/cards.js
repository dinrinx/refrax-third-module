document.addEventListener("DOMContentLoaded", () => {
  const cardsGrid = document.querySelector(".cards-grid");

  if (!cardsGrid) return;

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;

  const cards = () => Array.from(cardsGrid.querySelectorAll(".card"));

  function shuffleCards() {
    const shuffledCards = cards().sort(() => Math.random() - 0.5);

    shuffledCards.forEach((card) => {
      cardsGrid.appendChild(card);
    });
  }

  function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      if (firstCard) firstCard.classList.remove("flipped");
      if (secondCard) secondCard.classList.remove("flipped");

      resetBoard();
    }, 800);
  }

  function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", handleCardClick);
    secondCard.removeEventListener("click", handleCardClick);

    matchedPairs += 1;
    resetBoard();

    if (matchedPairs === cards().length / 2) {
      console.log("Все пары найдены");
    }
  }

  function checkForMatch() {
    if (!firstCard || !secondCard) return;

    const isMatch = firstCard.dataset.id === secondCard.dataset.id;

    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function handleCardClick(event) {
    const currentCard = event.currentTarget;

    if (lockBoard) return;
    if (currentCard === firstCard) return;
    if (currentCard.classList.contains("matched")) return;

    currentCard.classList.add("flipped");

    if (!firstCard) {
      firstCard = currentCard;
      return;
    }

    secondCard = currentCard;
    checkForMatch();
  }

  function startGame() {
    matchedPairs = 0;
    resetBoard();
    shuffleCards();

    cards().forEach((card) => {
      card.classList.remove("flipped", "matched");
      card.removeEventListener("click", handleCardClick);
      card.addEventListener("click", handleCardClick);
    });
  }

  startGame();
});
