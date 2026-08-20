(function () {
  const PAGE_COUNT = 358;
  const reader = document.querySelector("[data-reader]");
  const spread = document.querySelector("[data-reader-spread]");
  const stage = document.querySelector("[data-reader-stage]");
  const jumpForm = document.querySelector("[data-reader-jump]");
  const jumpInput = document.querySelector("[data-reader-jump-input]");
  const zoomLabel = document.querySelector("[data-reader-zoom-label]");
  const nightButton = document.querySelector("[data-reader-night]");
  const nightLabel = document.querySelector("[data-reader-night-label]");
  const previousButtons = document.querySelectorAll("[data-reader-previous]");
  const nextButtons = document.querySelectorAll("[data-reader-next]");

  if (!reader || !spread || !stage || !jumpForm || !jumpInput || !zoomLabel || !nightButton || !nightLabel) return;

  const workAnchors = {
    "letter-from-the-editor": 7,
    "honey-badger": 9,
    "of-roses-and-rivers": 31,
    "go-ask-alice": 47,
    "azra-up-to-bat": 65,
    "old-fashioned-seamed-nylon-stockings": 79,
    "confessions-of-a-robot-sideshow-attraction": 109,
    "signal-decay": 129,
    "men-dont-fall-in-love": 169,
    "into-me-see": 193,
    "the-shadow-of-a-name": 209,
    "lake-city-quiet-pills": 245,
    "the-portrait-of-a-satisfied-specimen": 259,
    "sum-of-parts": 275,
    "terminus": 305,
    "somewhere-warm-close-to-the-ocean": 331,
    "a-final-word": 353,
    "contributors": 355
  };

  const contentsLinks = {
    5: [
      ["Letter From the Editor", 7, 20.2, 3.5],
      ["Honey Badger by Didem Arslanoglu", 9, 24.4, 5.2],
      ["Of Roses and Rivers by James Joaquin Brewer", 31, 29.7, 5],
      ["Go Ask Alice by K. Thompson", 47, 34.7, 5],
      ["Azra Up to Bat by Zoe Carver", 65, 39.7, 5],
      ["Old-Fashioned Seamed Nylon Stockings by J. J. Steinfeld", 79, 44.6, 6.8],
      ["Confessions of a Robot Sideshow Attraction by E.J. LeRoy", 109, 51.6, 6.8],
      ["Signal Decay by Ys Goldt", 129, 58.4, 5],
      ["Men Don't Fall in Love by Danielle Ellis", 169, 63.5, 5],
      ["Into Me See by Sam Hendrian", 193, 68.5, 5],
      ["The Shadow of a Name by Diana Parrilla", 209, 73.5, 5],
      ["Lake City Quiet Pills by Viviane Fae-Moss", 245, 78.5, 5],
      ["The Portrait of a Satisfied Specimen by Sreeja Naskar", 259, 83.5, 7]
    ],
    6: [
      ["Sum of Parts by David Lewis", 275, 7.8, 4.5],
      ["Terminus by Kenneth D. Reimer", 305, 12.7, 4.8],
      ["Somewhere Warm, Close to the Ocean by Artemy Kalinovsky", 331, 17.8, 7],
      ["A Final Word", 353, 25.7, 3.2],
      ["Contributors", 355, 28.7, 3.2]
    ]
  };

  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let page = 1;
  let zoom = 1;
  let singlePage = mobileQuery.matches;
  let nightPages = darkQuery.matches;
  let touchStartX = 0;
  let priorFocus = null;

  const pageSource = (pageNumber) => `./pages/page-${String(pageNumber).padStart(3, "0")}.jpg`;
  const pageStep = () => (singlePage ? 1 : 2);

  const preloadPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > PAGE_COUNT) return;
    const preload = new Image();
    preload.src = pageSource(pageNumber);
  };

  const updateControls = () => {
    previousButtons.forEach((button) => { button.disabled = page === 1; });
    nextButtons.forEach((button) => { button.disabled = page >= PAGE_COUNT; });
    jumpInput.value = String(page);
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
    document.querySelector("[data-reader-zoom-out]").disabled = zoom <= 0.75;
    document.querySelector("[data-reader-zoom-in]").disabled = zoom >= 2;
    nightButton.setAttribute("aria-pressed", String(nightPages));
    nightLabel.textContent = nightPages ? "Light pages" : "Antique pages";
  };

  const renderSpread = () => {
    spread.replaceChildren();
    spread.classList.toggle("single-page", singlePage);
    spread.classList.toggle("night-pages", nightPages);
    spread.style.width = `${zoom * 100}%`;
    spread.style.maxWidth = zoom > 1 ? "none" : "";

    const visiblePages = singlePage ? [page] : [page, page + 1];
    visiblePages.filter((pageNumber) => pageNumber <= PAGE_COUNT).forEach((pageNumber) => {
      const sheet = document.createElement("div");
      sheet.className = "reader-sheet";

      const image = document.createElement("img");
      image.src = pageSource(pageNumber);
      image.alt = `Nachtljocht Volume I page ${pageNumber} of ${PAGE_COUNT}`;
      image.draggable = false;
      sheet.append(image);

      (contentsLinks[pageNumber] || []).forEach(([label, target, top, height]) => {
        const hotspot = document.createElement("button");
        hotspot.className = `contents-hotspot${pageNumber === 6 ? " contents-hotspot-short" : ""}`;
        hotspot.type = "button";
        hotspot.setAttribute("aria-label", `Go to ${label}`);
        hotspot.style.top = `${top}%`;
        hotspot.style.height = `${height}%`;
        hotspot.addEventListener("click", () => showPage(target));
        sheet.append(hotspot);
      });

      spread.append(sheet);
    });

    updateControls();
    preloadPage(page - pageStep());
    preloadPage(page + pageStep());
    preloadPage(page + 1);
  };

  function showPage(nextPage) {
    if (!Number.isFinite(nextPage)) return;
    page = Math.max(1, Math.min(PAGE_COUNT, Math.round(nextPage)));
    renderSpread();
  }

  const openReader = () => {
    priorFocus = document.activeElement;
    reader.hidden = false;
    document.body.classList.add("reader-is-open");
    renderSpread();
    reader.querySelector("[data-reader-close]").focus();
  };

  const closeReader = () => {
    reader.hidden = true;
    document.body.classList.remove("reader-is-open");
    if (priorFocus instanceof HTMLElement) priorFocus.focus();
  };

  document.querySelectorAll("[data-reader-open]").forEach((button) => button.addEventListener("click", openReader));
  document.querySelectorAll("[data-reader-close]").forEach((button) => button.addEventListener("click", closeReader));
  previousButtons.forEach((button) => button.addEventListener("click", () => showPage(page - pageStep())));
  nextButtons.forEach((button) => button.addEventListener("click", () => showPage(page + pageStep())));
  document.querySelector("[data-reader-contents]").addEventListener("click", () => showPage(5));
  document.querySelector("[data-reader-zoom-out]").addEventListener("click", () => { zoom = Math.max(0.75, zoom - 0.25); renderSpread(); });
  document.querySelector("[data-reader-zoom-in]").addEventListener("click", () => { zoom = Math.min(2, zoom + 0.25); renderSpread(); });
  nightButton.addEventListener("click", () => { nightPages = !nightPages; renderSpread(); });

  jumpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    showPage(Number(jumpInput.value));
  });

  stage.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  stage.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) >= 45) showPage(page + (distance < 0 ? pageStep() : -pageStep()));
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (reader.hidden) return;
    if (event.key === "Escape") closeReader();
    if (event.key === "ArrowLeft") showPage(page - pageStep());
    if (event.key === "ArrowRight") showPage(page + pageStep());
  });

  mobileQuery.addEventListener("change", (event) => {
    singlePage = event.matches;
    if (!reader.hidden) renderSpread();
  });

  darkQuery.addEventListener("change", (event) => {
    nightPages = event.matches;
    if (!reader.hidden) renderSpread();
  });

  const openLinkedWork = () => {
    const linkedPage = workAnchors[window.location.hash.slice(1).toLowerCase()];
    if (!linkedPage) return;
    showPage(linkedPage);
    openReader();
  };

  window.addEventListener("hashchange", openLinkedWork);
  openLinkedWork();
  updateControls();
})();
