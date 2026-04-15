const DEMO_ITEMS = [
  {
    id: "DM-MEN-001",
    name: "Men Lapel Short Sleeve",
    price: 15.1,
    originalPrice: 30.2,
    image: "/src/assets/products/discount_products/dis-1.png",
    badge: "50% OFF",
  },
  {
    id: "DM-WOMEN-002",
    name: "Babydoll Blouse",
    price: 18.2,
    originalPrice: 36.4,
    image: "/src/assets/products/discount_products/dis-2.png",
    badge: "50% OFF",
  },
  {
    id: "DM-MEN-003",
    name: "Oxford Button-Down",
    price: 19.5,
    originalPrice: 26.0,
    image: "/src/assets/products/new_arrivals/new-2.png",
    badge: "NEW",
  },
];

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
  }, 2600);
}

function moveToCart(item) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, size: "M", qty: 1 });
  }
  saveCart(cart);
  showToast(`${item.name} moved to cart!`);
}

function removeFromWishlist(id, cardEl) {
  cardEl.classList.add("removing");
  setTimeout(() => {
    const w = getWishlist().filter((i) => i.id !== id);
    saveWishlist(w);
    updateBadges();
    renderWishlist();
  }, 350);
}

function renderWishlist() {
  let items = getWishlist();
  if (items.length === 0) {
    if (!localStorage.getItem("dm_wish_seeded")) {
      saveWishlist(DEMO_ITEMS);
      localStorage.setItem("dm_wish_seeded", "1");
      items = DEMO_ITEMS;
    }
  }

  const grid = document.getElementById("wishlist-grid");
  const empty = document.getElementById("empty-state");
  const header = document.getElementById("wishlist-header"); // Add this
  const subtitle = document.getElementById("wish-subtitle");
  const addAllBtn = document.getElementById("add-all-btn");

  if (items.length === 0) {
    grid.innerHTML = "";
    empty.classList.replace("hidden", "flex");
    header.classList.add("hidden"); // Hide the header when empty
    addAllBtn.classList.replace("flex", "hidden");
    subtitle.textContent = "";
    updateBadges();
    return;
  }

  empty.classList.replace("flex", "hidden");
  header.classList.remove("hidden"); // Show the header when items exist
  addAllBtn.classList.replace("hidden", "flex");
  subtitle.textContent = `${items.length} item${items.length > 1 ? "s" : ""} saved`;

  grid.innerHTML = items
    .map(
      (item) => `
          <div class="wish-card" id="wish-${item.id}">
            <a href="product-detail.html">
              <img src="${item.image || "/src/assets/products/discount_products/dis-1.png"}" alt="${item.name}" class="w-full h-72 object-cover block sm:h-56" onerror="this.src='/src/assets/products/discount_products/dis-1.png'" />
            </a>
            ${item.badge ? `<div class="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded font-bold text-[0.78rem]">${item.badge}</div>` : ""}
            <button class="remove-btn" onclick="handleRemove('${item.id}')" title="Remove from wishlist">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="p-3.5">
              <a href="product-detail.html" class="no-underline">
                <p class="font-semibold text-[0.95rem] text-primary mb-1.5 leading-[1.3]">${item.name}</p>
              </a>
              <div class="flex items-center gap-2 mb-3.5">
                <span class="font-bold text-base text-red-500">$${item.price ? item.price.toFixed(2) : "—"}</span>
                ${item.originalPrice ? `<span class="text-[0.85rem] text-text-description line-through">$${item.originalPrice.toFixed(2)}</span>` : ""}
              </div>
              <button class="btn-add-cart" onclick="handleMoveToCart('${item.id}')">
                <i class="fa-solid fa-cart-plus"></i> Move to Cart
              </button>
            </div>
          </div>
        `,
    )
    .join("");

  updateBadges();
}

function handleRemove(id) {
  const card = document.getElementById("wish-" + id);
  removeFromWishlist(id, card);
}

function handleMoveToCart(id) {
  const items = getWishlist();
  const item = items.find((i) => i.id === id);
  if (item) {
    moveToCart(item);
    handleRemove(id);
    updateBadges();
  }
}

document.getElementById("add-all-btn").addEventListener("click", () => {
  const items = getWishlist();
  items.forEach((item) => moveToCart(item));
  saveWishlist([]);
  localStorage.removeItem("dm_wish_seeded");
  updateBadges();
  showToast(`All ${items.length} items moved to cart!`);
  setTimeout(renderWishlist, 400);
});

renderWishlist();
