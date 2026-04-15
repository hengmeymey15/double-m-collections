/* --- All existing JS logic preserved --- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("dm_cart") || "[]");
  } catch {
    return [];
  }
}
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("dm_wishlist") || "[]");
  } catch {
    return [];
  }
}
function saveCart(c) {
  localStorage.setItem("dm_cart", JSON.stringify(c));
}
function saveWishlist(w) {
  localStorage.setItem("dm_wishlist", JSON.stringify(w));
}

function updateBadges() {
  const cart = getCart();
  const wish = getWishlist();
  const cc = document.getElementById("cart-count");
  const wc = document.getElementById("wishlist-count");
  if (cc) cc.textContent = cart.reduce((s, i) => s + i.qty, 0);
  if (wc) wc.textContent = wish.length;
}

function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  t.classList.add("opacity-100", "translate-y-0");
  t.classList.remove("opacity-0", "translate-y-[100px]");
  setTimeout(() => {
    t.classList.remove("opacity-100", "translate-y-0");
    t.classList.add("opacity-0", "translate-y-[100px]");
  }, 2800);
}

document.querySelectorAll("#thumb-strip img").forEach((img) => {
  img.addEventListener("click", () => {
    document
      .querySelectorAll("#thumb-strip img")
      .forEach((i) => i.classList.remove("thumb-active"));
    img.classList.add("thumb-active");
    const main = document.getElementById("main-product-img");
    main.style.opacity = "0";
    setTimeout(() => {
      main.src = img.dataset.src;
      main.style.opacity = "1";
    }, 200);
  });
});

let selectedSize = null;
document.querySelectorAll(".size-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".size-btn")
      .forEach((b) => b.classList.remove("size-active"));
    btn.classList.add("size-active");
    selectedSize = btn.textContent;
    document.getElementById("selected-size").textContent = selectedSize;
  });
});

document.querySelectorAll(".color-dot").forEach((dot) => {
  dot.addEventListener("click", () => {
    document.querySelectorAll(".color-dot").forEach((d) => {
      d.classList.remove("outline-accent");
      d.style.outlineColor = "transparent";
    });
    dot.style.outlineColor = "#C2A878";
    document.getElementById("selected-color").textContent = dot.dataset.color;
  });
});

const qtyInput = document.getElementById("qty-input");
document.getElementById("qty-minus").addEventListener("click", () => {
  if (parseInt(qtyInput.value) > 1)
    qtyInput.value = parseInt(qtyInput.value) - 1;
});
document.getElementById("qty-plus").addEventListener("click", () => {
  if (parseInt(qtyInput.value) < 10)
    qtyInput.value = parseInt(qtyInput.value) + 1;
});

function addToCartMain() {
  if (!selectedSize) {
    showToast("Please select a size first!");
    return;
  }
  const cart = getCart();
  const qty = parseInt(qtyInput.value);
  const existing = cart.find(
    (i) => i.id === "DM-MEN-001" && i.size === selectedSize,
  );
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: "DM-MEN-001",
      name: "Men Lapel Short Sleeve",
      price: 15.1,
      image: "/src/assets/products/discount_products/dis-1.png",
      size: selectedSize,
      qty,
    });
  }
  saveCart(cart);
  updateBadges();
  showToast(`Added to cart — Size ${selectedSize} ×${qty}`);
}

document
  .getElementById("add-to-cart-btn")
  .addEventListener("click", addToCartMain);

const wishBtn = document.getElementById("wishlist-btn");
wishBtn.addEventListener("click", () => {
  const w = getWishlist();
  const idx = w.findIndex((i) => i.id === "DM-MEN-001");
  if (idx > -1) {
    w.splice(idx, 1);
    wishBtn.classList.remove("wishlist-active");
    showToast("Removed from wishlist");
  } else {
    w.push({
      id: "DM-MEN-001",
      name: "Men Lapel Short Sleeve",
      price: 15.1,
    });
    wishBtn.classList.add("wishlist-active");
    showToast("Added to wishlist ♥");
  }
  saveWishlist(w);
  updateBadges();
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("tab-active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.replace("block", "hidden"));
    btn.classList.add("tab-active");
    document
      .getElementById("tab-" + btn.dataset.tab)
      .classList.replace("hidden", "block");
  });
});

window.addEventListener("scroll", () => {
  const stickyBar = document.getElementById("sticky-buy");
  if (window.scrollY > 400) stickyBar.classList.remove("translate-y-full");
  else stickyBar.classList.add("translate-y-full");
});

updateBadges();
