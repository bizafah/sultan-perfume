// products.js - SULTAN Luxury Fragrances Data & Cart System

const PRODUCTS = [
    {
        id: 'ameer-al-oud',
        name: 'Ameer Al Oud',
        category: 'male',
        categoryName: 'Male Collection',
        price: 2200,
        image: 'Ameer al oud.jpeg',
        rating: 4.9,
        reviews: 128,
        tag: 'BESTSELLER',
        subtitle: 'Majestic Cambodian Oud & Golden Amber',
        description: 'A rich, majestic oriental fragrance featuring deep oud wood, warm spices, and golden amber. Crafted for the modern prince who commands elegance and timeless presence.',
        notes: {
            top: ['Cambodian Oud', 'Saffron', 'Nutmeg'],
            heart: ['Rosewood', 'Patchouli', 'Sandalwood'],
            base: ['Amber', 'Pure Musk', 'Vanilla']
        }
    },
    {
        id: 'hugo-boss',
        name: 'Hugo Boss',
        category: 'male',
        categoryName: 'Male Collection',
        price: 2200,
        image: 'hugo boss.jpeg',
        rating: 4.8,
        reviews: 95,
        tag: 'CLASSIC',
        subtitle: 'Crisp Citrus, Warm Cinnamon & Cedar',
        description: 'A crisp, confident masculine fragrance blending vibrant citrus top notes with a warm cinnamon heart and rich cedarwood base. Perfect for everyday sophistication.',
        notes: {
            top: ['Green Apple', 'Bergamot', 'Grapefruit'],
            heart: ['Geranium', 'Cinnamon', 'Clove'],
            base: ['Cedarwood', 'Vetiver', 'Sandalwood']
        }
    },
    {
        id: 'gucci-flora',
        name: 'Gucci Flora',
        category: 'female',
        categoryName: 'Female Collection',
        price: 2200,
        image: 'Gucci flora.jpeg',
        rating: 5.0,
        reviews: 142,
        tag: 'LUXURY',
        subtitle: 'Radiant Peony, Rose & Pink Pepper',
        description: 'An enchanting floral bouquet bursting with radiant peony, sweet citrus blossom, and sensual pink pepper notes. Elegant, playful, and undeniably feminine.',
        notes: {
            top: ['Citrus Blossom', 'Peony', 'Mandarin Orange'],
            heart: ['Rose Petals', 'Osmanthus', 'Gardenia'],
            base: ['Patchouli', 'Sandalwood', 'Pink Pepper']
        }
    },
    {
        id: 'sabaya',
        name: 'Sabaya',
        category: 'female',
        categoryName: 'Female Collection',
        price: 2200,
        image: 'Sabaya.jpeg',
        rating: 4.9,
        reviews: 110,
        tag: 'POPULAR',
        subtitle: 'White Rose, Green Citrus & Soft Musk',
        description: 'A captivating, sweet floral scent infused with delicate white roses, fresh green citrus, and a soft velvet musk finish. Evokes timeless grace.',
        notes: {
            top: ['Green Citrus', 'Orange Flower', 'Bergamot'],
            heart: ['White Rose', 'Jasmine Sambac', 'Lily of the Valley'],
            base: ['Soft Musk', 'Light Amber', 'Cedar']
        }
    },
    {
        id: 'golden-musk',
        name: 'Golden Musk',
        category: 'unisex',
        categoryName: 'Unisex Collection',
        price: 2200,
        image: 'golden dusk.jpeg',
        rating: 5.0,
        reviews: 164,
        tag: 'SIGNATURE',
        subtitle: 'Golden Amber, Royal Vanilla & White Musk',
        description: 'A warm, hypnotic fusion of golden amber, velvet vanilla, and pure white musk designed to enchant all genders. Unfolds with mesmerizing beauty.',
        notes: {
            top: ['Golden Amber', 'Citrus Sparkle', 'Cardamom'],
            heart: ['Royal Vanilla', 'Jasmine Bloom', 'Cashmere'],
            base: ['White Musk', 'Precious Woods', 'Tonka Bean']
        }
    }
];

const DELIVERY_CHARGE = 150;

// Cart System State Management
let cart = [];
try {
    const saved = localStorage.getItem('sultan_cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
} catch (e) {
    cart = [];
}

function saveCart() {
    try {
        localStorage.setItem('sultan_cart', JSON.stringify(cart));
    } catch (e) { }
    updateCartUI();
}

function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity
        });
    }

    saveCart();
    showToast(`${product.name} added to cart!`);
    openCartDrawer();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

function clearCart() {
    cart = [];
    saveCart();
}

function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartTotal() {
    const subtotal = getCartSubtotal();
    return subtotal > 0 ? subtotal + DELIVERY_CHARGE : 0;
}

function updateCartUI() {
    const count = getCartCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });

    const cartItemsContainer = document.getElementById('cartDrawerItems');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartDeliveryEl = document.getElementById('cartDelivery');
    const cartTotalEl = document.getElementById('cartTotal');

    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-16 text-gray-400 space-y-4">
                    <i data-lucide="shopping-bag" class="w-16 h-16 mx-auto opacity-30 text-[#d4af37]"></i>
                    <p class="serif text-xl text-white">Your cart is empty</p>
                    <p class="text-xs text-gray-500 font-light">Explore our luxury signature series and add your favorite fragrance.</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 transition-all hover:border-[#d4af37]/30">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-white/10">
                    <div class="flex-1">
                        <h4 class="serif text-lg font-light text-white">${item.name}</h4>
                        <div class="text-[#d4af37] text-sm font-medium">RS ${item.price.toLocaleString()}</div>
                        <div class="flex items-center gap-3 mt-2">
                            <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 rounded-full glass flex items-center justify-center text-xs text-white hover:bg-[#d4af37] hover:text-black transition-colors">-</button>
                            <span class="text-xs font-semibold text-white px-1">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 rounded-full glass flex items-center justify-center text-xs text-white hover:bg-[#d4af37] hover:text-black transition-colors">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-400 p-2 transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    const subtotal = getCartSubtotal();
    const delivery = subtotal > 0 ? DELIVERY_CHARGE : 0;
    const total = subtotal > 0 ? subtotal + delivery : 0;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `RS ${subtotal.toLocaleString()}`;
    if (cartDeliveryEl) cartDeliveryEl.textContent = subtotal > 0 ? `RS ${delivery.toLocaleString()}` : `RS 0`;
    if (cartTotalEl) cartTotalEl.textContent = `RS ${total.toLocaleString()}`;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            drawer.classList.remove('translate-x-full');
        }, 10);
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && overlay) {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300);
    }
}

function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        toast.className = 'fixed bottom-6 right-6 z-50 glass-dark border border-[#d4af37]/40 px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-20 opacity-0';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-[#d4af37]"></i> <span class="text-sm font-light">${message}</span>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    closeCartDrawer();
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        renderCheckoutSummary();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function renderCheckoutSummary() {
    const summaryContainer = document.getElementById('checkoutSummaryItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutDelivery = document.getElementById('checkoutDelivery');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (summaryContainer) {
        summaryContainer.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                <div>
                    <span class="font-medium text-white">${item.name}</span>
                    <span class="text-xs text-gray-400 ml-2">x${item.quantity}</span>
                </div>
                <span class="text-[#d4af37]">RS ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('');
    }

    const subtotal = getCartSubtotal();
    const total = getCartTotal();

    if (checkoutSubtotal) checkoutSubtotal.textContent = `RS ${subtotal.toLocaleString()}`;
    if (checkoutDelivery) checkoutDelivery.textContent = `RS ${DELIVERY_CHARGE.toLocaleString()}`;
    if (checkoutTotal) checkoutTotal.textContent = `RS ${total.toLocaleString()}`;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('custName')?.value || '';
    const phone = document.getElementById('custPhone')?.value || '';
    const address = document.getElementById('custAddress')?.value || '';
    const city = document.getElementById('custCity')?.value || '';

    if (!name || !phone || !address) {
        alert('Please fill in all required contact details.');
        return;
    }

    const orderNum = 'SLT-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = getCartSubtotal();
    const total = getCartTotal();

    let itemsText = cart.map(i => `- ${i.name} (x${i.quantity}) : RS ${(i.price * i.quantity).toLocaleString()}`).join('%0A');

    let msg = `*NEW ORDER FROM SULTAN WEBSITE*%0A%0A` +
        `*Order ID:* ${orderNum}%0A` +
        `*Customer:* ${encodeURIComponent(name)}%0A` +
        `*Phone:* ${encodeURIComponent(phone)}%0A` +
        `*Address:* ${encodeURIComponent(address)}, ${encodeURIComponent(city)}%0A%0A` +
        `*Items:*%0A${itemsText}%0A%0A` +
        `*Subtotal:* RS ${subtotal.toLocaleString()}%0A` +
        `*Delivery Charges:* RS ${DELIVERY_CHARGE}%0A` +
        `*Grand Total:* RS ${total.toLocaleString()}`;

    closeCheckoutModal();

    const successModal = document.getElementById('orderSuccessModal');
    const orderIdEl = document.getElementById('successOrderId');
    const whatsappBtn = document.getElementById('whatsappOrderBtn');

    if (orderIdEl) orderIdEl.textContent = orderNum;
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/923173961760?text=${msg}`;
    }

    if (successModal) {
        successModal.classList.remove('hidden');
        successModal.classList.add('flex');
    }

    clearCart();
}

function closeSuccessModal() {
    const successModal = document.getElementById('orderSuccessModal');
    if (successModal) {
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
