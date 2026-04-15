
function toggleWishlist(btn) {
    const product = {
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: parseFloat(btn.getAttribute('data-price')),
        image: btn.getAttribute('data-img')
    };

    let wishlist = JSON.parse(localStorage.getItem('dm_wishlist') || '[]');
    const index = wishlist.findIndex(item => item.id === product.id);

    if (index === -1) {
        wishlist.push(product);
        btn.classList.add('is-favorite');
    } else {
        wishlist.splice(index, 1);
        btn.classList.remove('is-favorite');
    }

    localStorage.setItem('dm_wishlist', JSON.stringify(wishlist));
    
    // Update navbar count if the function exists
    if (window.updateBadges) updateBadges();
}

// Sync heart colors when page loads
document.addEventListener('DOMContentLoaded', () => {
    const wishlist = JSON.parse(localStorage.getItem('dm_wishlist') || '[]');
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.getAttribute('data-id');
        if (wishlist.some(item => item.id === id)) {
            btn.classList.add('is-favorite');
        }
    });
});