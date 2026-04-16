
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

// function renderWishlist() {
//   let items = getWishlist();
//   if (items.length === 0) {
//     if (!localStorage.getItem("dm_wish_seeded")) {
//       saveWishlist(DEMO_ITEMS);
//       localStorage.setItem("dm_wish_seeded", "1");
//       items = DEMO_ITEMS;
//     }
//   }

//   const grid = document.getElementById("wishlist-grid");
//   const empty = document.getElementById("empty-state");
//   const header = document.getElementById("wishlist-header"); // Add this
//   const subtitle = document.getElementById("wish-subtitle");
//   const addAllBtn = document.getElementById("add-all-btn");

//   if (items.length === 0) {
//     grid.innerHTML = "";
//     empty.classList.replace("hidden", "flex");
//     header.classList.add("hidden"); // Hide the header when empty
//     addAllBtn.classList.replace("flex", "hidden");
//     subtitle.textContent = "";
//     updateBadges();
//     return;
//   }

//   empty.classList.replace("flex", "hidden");
//   header.classList.remove("hidden"); // Show the header when items exist
//   addAllBtn.classList.replace("hidden", "flex");
//   subtitle.textContent = `${items.length} item${items.length > 1 ? "s" : ""} saved`;

//   grid.innerHTML = items
//     .map(
//       (item) => `
//           <div class="wish-card" id="wish-${item.id}">
//             <a href="product-detail.html">
//               <img src="${item.image || "/src/assets/products/discount_products/dis-1.png"}" alt="${item.name}" class="w-full h-72 object-cover block sm:h-56" onerror="this.src='/src/assets/products/discount_products/dis-1.png'" />
//             </a>
//             ${item.badge ? `<div class="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded font-bold text-[0.78rem]">${item.badge}</div>` : ""}
//             <button class="remove-btn" onclick="handleRemove('${item.id}')" title="Remove from wishlist">
//               <i class="fa-solid fa-xmark"></i>
//             </button>
//             <div class="p-3.5">
//               <a href="product-detail.html" class="no-underline">
//                 <p class="font-semibold text-[0.95rem] text-primary mb-1.5 leading-[1.3]">${item.name}</p>
//               </a>
//               <div class="flex items-center gap-2 mb-3.5">
//                 <span class="font-bold text-base text-red-500">$${item.price ? item.price.toFixed(2) : "—"}</span>
//                 ${item.originalPrice ? `<span class="text-[0.85rem] text-text-description line-through">$${item.originalPrice.toFixed(2)}</span>` : ""}
//               </div>
//               <button class="btn-add-cart" onclick="handleMoveToCart('${item.id}')">
//                 <i class="fa-solid fa-cart-plus"></i> Move to Cart
//               </button>
//             </div>
//           </div>
//         `,
//     )
//     .join("");

//   updateBadges();
// }

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
  const header = document.getElementById("wishlist-header");
  const subtitle = document.getElementById("wish-subtitle");

  if (items.length === 0) {
    grid.innerHTML = "";
    empty.classList.replace("hidden", "flex");
    header.classList.add("hidden");
    subtitle.textContent = "";
    updateBadges();
    return;
  }

  empty.classList.replace("flex", "hidden");
  header.classList.remove("hidden");
  subtitle.textContent = `${items.length} item${items.length > 1 ? "s" : ""} saved`;

  grid.innerHTML = items
    .map(
      (item) => `
          <div id="wish-${item.id}" class="rounded-base border border-border-color bg-white p-3 shadow-sm transition-all duration-300">
            
            <div class="relative h-[400px] w-full border-b border-b-border-color">
              <a href="/pages/product-detail.html">
                <img
                  class="mx-auto h-full w-full object-cover"
                  src="${item.image || "/src/assets/products/discount_products/dis-1.png"}"
                  alt="${item.name}"
                  onerror="this.src='/src/assets/products/discount_products/dis-1.png'"
                />
              </a>
              ${item.badge ? `
              <div class="absolute top-2 right-2">
                <span class="rounded-xs bg-red-600 text-white py-1 px-2 text-[14px] font-semibold">
                  ${item.badge}
                </span>
              </div>` : ''}
            </div>

            <div class="pt-2">
              <div class="mb-2 flex items-center justify-between gap-2">
                <a
                  href="/pages/product-detail.html"
                  class="text-lg font-semibold leading-tight text-primary hover:text-accent transition-colors"
                >
                  ${item.name}
                </a>

                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onclick="handleRemove('${item.id}')"
                    class="p-2 text-red-600 rounded-base hover:bg-gray-100 transition-all duration-200"
                    title="Remove from wishlist"
                  >
                    <svg
                      class="h-6 w-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6C6.5 1 1 8 5.8 13l6.2 7 6.2-7C23 8 17.5 1 12 6Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3">
                <p class="text-xl font-semibold leading-tight text-primary">
                  $${item.price ? item.price.toFixed(2) : "—"}
                </p>

                <a
                  href="/pages/product-detail.html"
                  class="inline-flex items-center rounded-md px-3.5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-4 focus:ring-accent transition-all duration-200 cursor-pointer"
                >
                  View Detail
                </a>
              </div>
            </div>
          </div>
        `
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

