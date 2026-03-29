document.addEventListener("DOMContentLoaded", function () {
  const popupCloseButtons = document.querySelectorAll(
    ".second-screen-popup-close",
  );

  popupCloseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const popup = button.closest(".second-screen-popup");

      if (popup) {
        popup.classList.add("is-hidden");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const secondScreenText = document.querySelector(".second-screen-text");

  if (secondScreenText) {
    const text = secondScreenText.textContent.trim();
    const words = text.split(" ");
    secondScreenText.innerHTML = "";

    let charIndex = 0;

    words.forEach(function (word, wordIndex) {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word");

      word.split("").forEach(function (symbol) {
        const charSpan = document.createElement("span");
        charSpan.classList.add("char");
        charSpan.style.setProperty("--char-index", charIndex);
        charSpan.textContent = symbol;
        wordSpan.appendChild(charSpan);
        charIndex += 1;
      });

      secondScreenText.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        secondScreenText.appendChild(document.createTextNode(" "));
      }
    });
  }

  const popupCloseButtons = document.querySelectorAll(
    ".second-screen-popup-close",
  );

  popupCloseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const popup = button.closest(".second-screen-popup");

      if (popup) {
        popup.classList.add("is-hidden");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const secondScreenText = document.querySelector(".second-screen-text");
  const secondScreenMainWindow = document.querySelector(
    ".second-screen-main-window",
  );
  const popups = Array.from(document.querySelectorAll(".second-screen-popup"));
  const popupCloseButtons = document.querySelectorAll(
    ".second-screen-popup-close",
  );

  let restoreTimer = null;

  if (secondScreenText) {
    const text = secondScreenText.textContent.trim();
    const words = text.split(" ");
    secondScreenText.innerHTML = "";

    let charIndex = 0;

    words.forEach(function (word, wordIndex) {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word");

      word.split("").forEach(function (symbol) {
        const charSpan = document.createElement("span");
        charSpan.classList.add("char");
        charSpan.style.setProperty("--char-index", charIndex);
        charSpan.textContent = symbol;
        wordSpan.appendChild(charSpan);
        charIndex += 1;
      });

      secondScreenText.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        secondScreenText.appendChild(document.createTextNode(" "));
      }
    });
  }

  function allPopupsHidden() {
    return popups.every(function (popup) {
      return popup.classList.contains("is-hidden");
    });
  }

  function restoreSecondScreen() {
    if (!secondScreenMainWindow) return;

    popups.forEach(function (popup) {
      popup.classList.remove("is-hidden");
    });

    secondScreenMainWindow.classList.remove("is-fading-out");
  }

  popupCloseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const popup = button.closest(".second-screen-popup");

      if (popup) {
        popup.classList.add("is-hidden");
      }

      if (allPopupsHidden() && secondScreenMainWindow) {
        secondScreenMainWindow.classList.add("is-fading-out");

        clearTimeout(restoreTimer);
        restoreTimer = setTimeout(function () {
          restoreSecondScreen();
        }, 2000);
      }
    });
  });
});
