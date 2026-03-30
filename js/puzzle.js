document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".puzzle-board");
  const pieces = Array.from(document.querySelectorAll(".puzzle-piece"));
  const dropZones = Array.from(document.querySelectorAll(".drop-zone"));

  if (!board || !pieces.length || !dropZones.length) return;

  let activePiece = null;
  let shiftX = 0;
  let shiftY = 0;
  let placedCount = 0;

  const startPositions = new Map();

  pieces.forEach((piece) => {
    const computed = window.getComputedStyle(piece);

    startPositions.set(piece, {
      left: piece.style.left || computed.left,
      top: piece.style.top || computed.top,
      right: piece.style.right || computed.right,
      bottom: piece.style.bottom || computed.bottom,
      width: piece.style.width || computed.width,
      height: piece.style.height || computed.height,
      parent: piece.parentElement,
    });

    piece.draggable = false;

    piece.addEventListener("mousedown", onMouseDown);
  });

  function onMouseDown(event) {
    const piece = event.currentTarget;

    if (piece.classList.contains("is-placed")) return;

    event.preventDefault();

    activePiece = piece;
    activePiece.classList.add("is-dragging");

    const pieceRect = activePiece.getBoundingClientRect();

    shiftX = event.clientX - pieceRect.left;
    shiftY = event.clientY - pieceRect.top;

    if (activePiece.parentElement !== board) {
      board.appendChild(activePiece);
    }

    activePiece.style.position = "absolute";
    activePiece.style.right = "auto";
    activePiece.style.bottom = "auto";
    activePiece.style.transform = "none";
    activePiece.style.zIndex = "20";

    moveAt(event.clientX, event.clientY);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(event) {
    if (!activePiece) return;

    moveAt(event.clientX, event.clientY);
    highlightDropZone();
  }

  function moveAt(clientX, clientY) {
    if (!activePiece) return;

    const boardRect = board.getBoundingClientRect();

    let left = clientX - boardRect.left - shiftX;
    let top = clientY - boardRect.top - shiftY;

    const maxLeft = boardRect.width - activePiece.offsetWidth;
    const maxTop = boardRect.height - activePiece.offsetHeight;

    left = Math.max(0, Math.min(left, maxLeft));
    top = Math.max(0, Math.min(top, maxTop));

    activePiece.style.left = `${left}px`;
    activePiece.style.top = `${top}px`;
  }

  function onMouseUp() {
    if (!activePiece) return;

    const matchingDrop = getMatchingDropZone(activePiece);

    clearDropHighlights();

    if (matchingDrop) {
      placePiece(activePiece, matchingDrop);
    } else {
      returnPiece(activePiece);
    }

    activePiece.classList.remove("is-dragging");
    activePiece = null;

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }

  function getMatchingDropZone(piece) {
    const pieceName = piece.dataset.piece;
    if (!pieceName) return null;

    const correctZone = dropZones.find(
      (zone) => zone.dataset.accept === pieceName,
    );

    if (!correctZone) return null;

    const pieceRect = piece.getBoundingClientRect();
    const zoneRect = correctZone.getBoundingClientRect();

    const pieceCenterX = pieceRect.left + pieceRect.width / 2;
    const pieceCenterY = pieceRect.top + pieceRect.height / 2;

    const isInside =
      pieceCenterX >= zoneRect.left &&
      pieceCenterX <= zoneRect.right &&
      pieceCenterY >= zoneRect.top &&
      pieceCenterY <= zoneRect.bottom;

    return isInside ? correctZone : null;
  }

  function highlightDropZone() {
    if (!activePiece) return;

    clearDropHighlights();

    const pieceName = activePiece.dataset.piece;
    const correctZone = dropZones.find(
      (zone) => zone.dataset.accept === pieceName,
    );

    if (!correctZone) return;

    const pieceRect = activePiece.getBoundingClientRect();
    const zoneRect = correctZone.getBoundingClientRect();

    const pieceCenterX = pieceRect.left + pieceRect.width / 2;
    const pieceCenterY = pieceRect.top + pieceRect.height / 2;

    const isInside =
      pieceCenterX >= zoneRect.left &&
      pieceCenterX <= zoneRect.right &&
      pieceCenterY >= zoneRect.top &&
      pieceCenterY <= zoneRect.bottom;

    if (isInside) {
      correctZone.classList.add("is-hovered");
    }
  }

  function clearDropHighlights() {
    dropZones.forEach((zone) => zone.classList.remove("is-hovered"));
  }

  function placePiece(piece, dropZone) {
    dropZone.appendChild(piece);

    piece.style.position = "absolute";
    piece.style.left = "0";
    piece.style.top = "0";
    piece.style.right = "auto";
    piece.style.bottom = "auto";
    piece.style.width = "100%";
    piece.style.height = "100%";
    piece.style.zIndex = "5";

    piece.classList.add("is-placed");
    dropZone.classList.add("is-filled");

    piece.removeEventListener("mousedown", onMouseDown);

    placedCount += 1;

    if (placedCount === pieces.length) {
      board.classList.add("is-complete");
    }
  }

  function returnPiece(piece) {
    const start = startPositions.get(piece);
    if (!start) return;

    if (start.parent && piece.parentElement !== start.parent) {
      start.parent.appendChild(piece);
    }

    piece.style.position = "absolute";
    piece.style.left = start.left;
    piece.style.top = start.top;
    piece.style.right = start.right;
    piece.style.bottom = start.bottom;
    piece.style.width = start.width;
    piece.style.height = start.height;
    piece.style.zIndex = "4";

    piece.classList.add("is-wrong");

    setTimeout(() => {
      piece.classList.remove("is-wrong");
    }, 350);
  }
});
