function filterProducts(btn, cat) {
  // Update active button
  document
    .querySelectorAll(".cat-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  const cards = document.querySelectorAll(".product-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const cardCat = card.getAttribute("data-cat");
    const isSale = card.getAttribute("data-sale") === "true";
    let show = false;

    if (cat === "all") {
      show = true;
    } else if (cat === "sale") {
      show = isSale;
    } else {
      show = cardCat === cat;
    }

    card.classList.toggle("hidden", !show);
    if (show) visibleCount++;
  });

  // Update results text
  const resultsText = document.getElementById("resultsText");
  if (cat === "all") {
    resultsText.textContent = `Showing all ${visibleCount} items`;
  } else if (cat === "sale") {
    resultsText.textContent = `${visibleCount} item${visibleCount !== 1 ? "s" : ""} on sale`;
  } else {
    const label = btn.textContent
      .replace(/\d+/g, "")
      .trim()
      .split(" 🔥")[0]
      .trim();
    resultsText.textContent = `${visibleCount} item${visibleCount !== 1 ? "s" : ""} in ${label}`;
  }

  // Show/hide empty state
  document.getElementById("emptyState").style.display =
    visibleCount === 0 ? "flex" : "none";
}

// Count badges on load
window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");
  const cats = { all: 0, shirts: 0, pants: 0, jeans: 0, sets: 0, sale: 0 };

  cards.forEach((card) => {
    const cat = card.getAttribute("data-cat");
    const isSale = card.getAttribute("data-sale") === "true";
    cats.all++;
    if (cats[cat] !== undefined) cats[cat]++;
    if (isSale) cats.sale++;
  });

  Object.entries(cats).forEach(([key, val]) => {
    const badge = document.getElementById("count-" + key);
    if (badge) badge.textContent = val;
  });

  document.getElementById("resultsText").textContent =
    `Showing all ${cats.all} items`;
});
