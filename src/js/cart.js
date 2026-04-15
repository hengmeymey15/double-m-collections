let promoDiscount = 0;

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("dm_cart") || "[]");
  } catch {
    return [];
  }
}
function saveCart(c) {
  localStorage.setItem("dm_cart", JSON.stringify(c));
}

function updateBadges() {
  const cart = getCart();
  const cc = document.getElementById("cart-count");
  const wc = document.getElementById("wishlist-count");
  if (cc) cc.textContent = cart.reduce((s, i) => s + i.qty, 0);
  const w = JSON.parse(localStorage.getItem("dm_wishlist") || "[]");
  if (wc) wc.textContent = w.length;
}

function showToast(msg) {
  const t = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  t.classList.add("opacity-100", "translate-y-0");
  t.classList.remove("opacity-0", "translate-y-[100px]");
  setTimeout(() => {
    t.classList.remove("opacity-100", "translate-y-0");
    t.classList.add("opacity-0", "translate-y-[100px]");
  }, 2500);
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart-container");
  const empty = document.getElementById("empty-cart");

  if (cart.length === 0) {
    container.classList.add("hidden");
    empty.classList.replace("hidden", "flex");
    updateSummary();
    return;
  }

  container.classList.remove("hidden");
  empty.classList.replace("flex", "hidden");

  container.innerHTML = cart
    .map(
      (item, idx) => `
          <div class="cart-item flex gap-5 px-5 py-5" id="item-${idx}">
            <img src="${item.image}" class="w-35 h-40 object-cover rounded-lg border border-border-color" />
            <div class="flex-1 flex flex-col">
              <div class="flex justify-between mb-1">
                <h3 class="font-bold text-primary text-xl m-0">${item.name}</h3>
                <button onclick="removeItem(${idx}, '${item.size}')" class="bg-transparent text-lg border-none text-gray-400 cursor-pointer hover:text-red-500 transition-colors"><i class="fa-regular fa-trash-can"></i></button>
              </div>
              <p class="text-text-description text-base mb-1">Size: <span class="text-primary font-medium uppercase">${item.size}</span></p>
              <p class="text-text-description text-base">Color: <span class="text-primary font-medium uppercase">${item.color}</span></p>
              
              <div class="mt-auto flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <button class="qty-btn border border-border-color px-2.5 py-1" onclick="updateQty(${idx}, -1)"><i class="fa-solid fa-minus text-[0.7rem]"></i></button>
                  <span class="w-8 text-center font-bold text-base">${item.qty}</span>
                  <button class="qty-btn border border-border-color px-2.5 py-1" onclick="updateQty(${idx}, 1)"><i class="fa-solid fa-plus text-[0.7rem]"></i></button>
                </div>
                <div class="flex flex-col items-end">
                   <span class="text-lg font-extrabold text-primary">$${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        `,
    )
    .join("");

  updateSummary();
  updateBadges();
}

function updateQty(idx, delta) {
  const cart = getCart();
  cart[idx].qty += delta;
  if (cart[idx].qty < 1) cart[idx].qty = 1;
  saveCart(cart);
  renderCart();
}

function removeItem(idx, size) {
  const el = document.getElementById(`item-${idx}`);
  el.classList.add("removing");
  setTimeout(() => {
    const cart = getCart();
    cart.splice(idx, 1);
    saveCart(cart);
    renderCart();
  }, 300);
}

function updateSummary() {
  const cart = getCart();
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, sub - promoDiscount);

  document.getElementById("subtotal").textContent = `$${sub.toFixed(2)}`;
  document.getElementById("total").textContent = `$${total.toFixed(2)}`;

  const pr = document.getElementById("promo-row");
  if (promoDiscount > 0) {
    pr.classList.remove("hidden");
    document.getElementById("discount").textContent =
      `-$${promoDiscount.toFixed(2)}`;
  } else {
    pr.classList.add("hidden");
  }
}

function saveToWishlist(id, size) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id && i.size === size);
  let w = JSON.parse(localStorage.getItem("dm_wishlist") || "[]");
  if (!w.find((i) => i.id === id)) {
    w.push({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
    });
    localStorage.setItem("dm_wishlist", JSON.stringify(w));
  }
  const idx = cart.findIndex((i) => i.id === id && i.size === size);
  removeItem(idx, size);
  showToast(`Saved to wishlist!`);
}

const VALID_PROMOS = { SAVE10: 10, DOUBLE20: 20, WELCOME5: 5 };
function applyPromo() {
  const code = document
    .getElementById("promo-input")
    .value.trim()
    .toUpperCase();
  const msg = document.getElementById("promo-msg");
  if (VALID_PROMOS[code]) {
    promoDiscount = VALID_PROMOS[code];
    msg.className = "text-[0.75rem] mt-2 text-green-500";
    msg.textContent = `✓ Code "${code}" applied — $${promoDiscount.toFixed(2)} off!`;
    updateSummary();
    showToast(`Promo applied!`);
  } else {
    msg.className = "text-[0.75rem] mt-2 text-red-500";
    msg.textContent = "Invalid code. Try: SAVE10, DOUBLE20";
  }
}

function handleCheckout() {
  showToast("Redirecting to checkout...");
}

renderCart();
