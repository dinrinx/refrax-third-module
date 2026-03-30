document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("drawCanvas");
  const paletteButtons = Array.from(
    document.querySelectorAll(".palette__color"),
  );

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let isDrawing = false;
  let currentColor = "#222222";
  let brushSize = 8;
  let lastX = 0;
  let lastY = 0;

  function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
  }

  function getPoint(event) {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(event) {
    event.preventDefault();

    isDrawing = true;
    const point = getPoint(event);
    lastX = point.x;
    lastY = point.y;

    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;

    ctx.beginPath();
    ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
    }
  }

  function draw(event) {
    if (!isDrawing) return;

    const point = getPoint(event);

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastX = point.x;
    lastY = point.y;
  }

  function stopDrawing(event) {
    isDrawing = false;

    if (event && canvas.releasePointerCapture) {
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch (error) {
        // ничего не делаем
      }
    }
  }

  paletteButtons.forEach((button, index) => {
    if (index === 0) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      currentColor = button.dataset.color || "#222222";

      paletteButtons.forEach((item) => {
        item.classList.remove("is-active");
      });

      button.classList.add("is-active");
    });
  });

  setupCanvas();

  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);

  window.addEventListener("resize", setupCanvas);
});
