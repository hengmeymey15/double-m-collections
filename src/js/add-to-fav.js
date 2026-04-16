// Load wishlist from localStorage on page load
const wishlist = new Set(JSON.parse(localStorage.getItem('wishlist') || '[]'));

// Restore heart states on page load
document.querySelectorAll('[data-id]').forEach(btn => {
  if (wishlist.has(Number(btn.dataset.id))) {
    setActive(btn, true);
  }
});

function toggleWishlist(btn, id) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    setActive(btn, false);
  } else {
    wishlist.add(id);
    setActive(btn, true);
  }
  // Save to localStorage so wishlist page can read it
  localStorage.setItem('wishlist', JSON.stringify([...wishlist]));
}

function setActive(btn, active) {
  const path = btn.querySelector('path');
  if (active) {
    path.setAttribute('fill', '#dc2626');
    path.setAttribute('stroke', '#dc2626');
  } else {
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
  }
}