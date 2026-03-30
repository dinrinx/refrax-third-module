document.addEventListener("DOMContentLoaded", () => {
  const swiper = document.querySelector(".cassettes-swiper");
  const wrapper = swiper?.querySelector(".swiper-wrapper");
  const slides = Array.from(swiper?.querySelectorAll(".swiper-slide") || []);
  const prevArrow = document.querySelector(".cassettes-arrow-prev");
  const nextArrow = document.querySelector(".cassettes-arrow-next");

  const infoBackground = document.querySelector(".cassette-info-background");
  const infoTitle = document.querySelector(".cassette-info-title");
  const infoText = document.querySelector(".cassette-info-text");
  const infoButton = document.querySelector(".cassette-info-button");

  if (
    !swiper ||
    !wrapper ||
    !slides.length ||
    !prevArrow ||
    !nextArrow ||
    !infoBackground ||
    !infoTitle ||
    !infoText ||
    !infoButton
  ) {
    return;
  }

  const cassetteButtons = slides
    .map((slide) => slide.querySelector(".cassette-button"))
    .filter(Boolean);

  let currentIndex = 0;
  let selectedCassetteId = null;
  let isLocked = false;

  const player = new Audio();
  let currentAudioId = null;

  function getActiveButton() {
    return cassetteButtons[currentIndex] || null;
  }

  function updateSlider() {
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateInfo();
    updateArrows();
  }

  function updateInfo() {
    const activeButton = getActiveButton();
    if (!activeButton) return;

    infoBackground.src = activeButton.dataset.background || "";
    infoTitle.textContent = activeButton.dataset.title || "";
    infoText.textContent = activeButton.dataset.text || "";

    const isSelected = selectedCassetteId === activeButton.dataset.id;
    infoButton.textContent = isSelected ? "ВЫБРАНО" : "ВЫБРАТЬ";
    infoButton.classList.toggle("is-selected", isSelected);
  }

  function updateArrows() {
    if (isLocked) {
      prevArrow.classList.add("is-disabled");
      nextArrow.classList.add("is-disabled");
      return;
    }

    prevArrow.classList.toggle("is-disabled", currentIndex === 0);
    nextArrow.classList.toggle(
      "is-disabled",
      currentIndex === slides.length - 1,
    );
  }

  function clearPlayingState() {
    cassetteButtons.forEach((button) => {
      button.classList.remove("is-playing");
    });
  }

  function stopAudio() {
    player.pause();
    player.currentTime = 0;
    currentAudioId = null;
    clearPlayingState();
  }

  function playAudioFromStart(button) {
    const audioPath = button.dataset.audio;
    if (!audioPath) return;

    clearPlayingState();
    player.pause();
    player.currentTime = 0;
    player.src = audioPath;
    currentAudioId = button.dataset.id;
    button.classList.add("is-playing");

    player.play().catch(() => {});
  }

  function toggleButtonAudio(button) {
    const audioPath = button.dataset.audio;
    if (!audioPath) return;

    const isSameCassette = currentAudioId === button.dataset.id;
    const isPlayingNow = !player.paused;

    if (isSameCassette && isPlayingNow) {
      stopAudio();
      return;
    }

    playAudioFromStart(button);
  }

  prevArrow.addEventListener("click", () => {
    if (isLocked) return;
    if (currentIndex === 0) return;

    currentIndex -= 1;
    updateSlider();
  });

  nextArrow.addEventListener("click", () => {
    if (isLocked) return;
    if (currentIndex === slides.length - 1) return;

    currentIndex += 1;
    updateSlider();
  });

  cassetteButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (isLocked) {
        if (button.dataset.id !== selectedCassetteId) return;
        toggleButtonAudio(button);
        return;
      }

      if (currentIndex !== index) {
        currentIndex = index;
        updateSlider();
        return;
      }

      toggleButtonAudio(button);
    });
  });

  infoButton.addEventListener("click", () => {
    const activeButton = getActiveButton();
    if (!activeButton) return;

    selectedCassetteId = activeButton.dataset.id;
    isLocked = true;

    cassetteButtons.forEach((button) => {
      const isCurrent = button.dataset.id === selectedCassetteId;
      button.classList.toggle("is-disabled", !isCurrent);
    });

    updateInfo();
    updateArrows();

    // по "Выбрать" — снова запуск с начала
    playAudioFromStart(activeButton);
  });

  player.addEventListener("ended", () => {
    currentAudioId = null;
    clearPlayingState();
  });

  updateSlider();
});
