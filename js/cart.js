/**
 * ShopVerse E-commerce Platform
 * Shopping Cart Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initCart();
});

/**
 * Initialize Shopping Cart
 */
function initCart() {
    // Retrieve cart from localStorage or initialize empty cart
    let cart = JSON.parse(localStorage.getItem('shopverse-cart')) || [];

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.getAttribute('data-product-id');
            const productData = getProductById(productId);

            if (productData) {
                addToCart(productData);
                showNotification('Product added to cart!', 'success');
            }
        });
    });

    // Initialize quantity controls in quick view modal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const input = e.target.parentElement.querySelector('input[type="number"]');

            if (e.target.classList.contains('plus')) {
                input.value = parseInt(input.value) + 1;
            } else if (e.target.classList.contains('minus')) {
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            }
        }

        // Add to cart from quick view modal
        if (e.target.classList.contains('add-to-cart')) {
            const modal = document.getElementById('quickViewModal');
            const quantityInput = modal.querySelector('input[type="number"]');
            const quantity = parseInt(quantityInput ? quantityInput.value : 1);

            // For simplicity, we'll use a placeholder product
            // In a real app, you would get the current product details
            const productData = {
                id: 'modal-product',
                name: modal.querySelector('.product-title').textContent,
                price: parseFloat(modal.querySelector('.price').textContent.replace('$', '')),
                image: modal.querySelector('img').src,
                quantity: quantity
            };

            addToCart(productData);
            showNotification('Product added to cart!', 'success');

            // Close the modal
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Update cart count on load
    updateCartCount();

    /**
     * Add product to cart
     * @param {Object} product - Product data to add
     */
    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            // If item already in cart, update quantity
            cart[existingItemIndex].quantity += product.quantity || 1;
        } else {
            // Add new item
            if (!product.quantity) product.quantity = 1;
            cart.push(product);
        }

        // Save to localStorage
        localStorage.setItem('shopverse-cart', JSON.stringify(cart));

        // Update UI
        updateCartUI();
    }

    /**
     * Update cart UI elements
     */
    function updateCartUI() {
        updateCartCount();
        updateMiniCart();
    }

    /**
     * Update cart count in header
     */
    function updateCartCount() {
        const cartCount = document.querySelectorAll('.action__item.cart .count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        cartCount.forEach(counter => {
            counter.textContent = totalItems;
        });
    }

    /**
     * Update mini cart dropdown
     */
    function updateMiniCart() {
        const miniCart = document.querySelector('.mini-cart');
        const miniCartEmpty = document.querySelector('.mini-cart__empty');
        const miniCartTotal = miniCart ? miniCart.querySelector('.mini-cart__total span:last-child') : null;


        if (!miniCart) return;

        // If cart is empty
        if (cart.length === 0) {
            if (miniCartEmpty) {
                miniCartEmpty.style.display = 'block';
            }
            if (miniCartTotal) {
                miniCartTotal.textContent = '$0.00';
            }

            // Remove any existing items
            const existingItems = miniCart.querySelectorAll('.mini-cart__item');
            existingItems.forEach(item => item.remove());

            return;
        }

        // Hide empty message
        if (miniCartEmpty) {
            miniCartEmpty.style.display = 'none';
        }

        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (miniCartTotal) {
            miniCartTotal.textContent = `$${total.toFixed(2)}`;
        }

        // Remove existing items
        const existingItems = miniCart.querySelectorAll('.mini-cart__item');
        existingItems.forEach(item => item.remove());

        // Insert new items before footer
        const footer = miniCart.querySelector('.mini-cart__footer');

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'mini-cart__item';

            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">
                        <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="item-remove" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </div>
            `;

            miniCart.insertBefore(itemElement, footer);

            // Add remove event listener
            const removeBtn = itemElement.querySelector('.item-remove');
            removeBtn.addEventListener('click', function() {
                removeFromCart(this.getAttribute('data-id'));
            });
        });
    }

    /**
     * Remove item from cart
     * @param {string} productId - ID of product to remove
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);

        // Save to localStorage
        localStorage.setItem('shopverse-cart', JSON.stringify(cart));

        // Update UI
        updateCartUI();
        showNotification('Product removed from cart', 'info');
    }

    /**
     * Show notification
     * @param {string} message - Message to display
     * @param {string} type - Notification type (success, error, info)
     */
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <p>${message}</p>
            </div>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Get product data by ID
     * @param {string} productId - ID of the product to retrieve
     * @returns {Object|null} Product data or null if not found
     */
    function getProductById(productId) {
        // This would typically be an API call or database query
        // For this demo, we'll return mock data based on ID

        const products = {
            '1': {
                id: '1',
                name: 'Wireless Noise Cancelling Headphones',
                price: 249.99,
                image: 'https://via.placeholder.com/300',
                category: 'Electronics'
            },
            '2': {
                id: '2',
                name: 'Smart Watch Series 5',
                price: 319.99,
                image: 'https://via.placeholder.com/300',
                category: 'Electronics'
            },
            '3': {
                id: '3',
                name: 'Premium Leather Handbag',
                price: 189.99,
                image: 'https://via.placeholder.com/300',
                category: 'Fashion'
            },
            '4': {
                id: '4',
                name: 'Smart Home Speaker',
                price: 149.99,
                image: 'https://via.placeholder.com/300',
                category: 'Electronics'
            },
            '5': {
                id: '5',
                name: 'Premium Coffee Maker',
                price: 110.50,
                image: 'https://via.placeholder.com/300',
                category: 'Home & Furniture'
            }
        };

        return products[productId] || null;
    }
}

/**
 * Add styles for notifications
 */
(function addCartStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            padding: 15px 20px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            z-index: 9999;
            max-width: 300px;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification i {
            font-size: 20px;
        }
        
        .notification p {
            margin: 0;
        }
        
        .notification.success {
            border-left: 4px solid #38b2ac;
        }
        
        .notification.success i {
            color: #38b2ac;
        }
        
        .notification.error {
            border-left: 4px solid #e53e3e;
        }
        
        .notification.error i {
            color: #e53e3e;
        }
        
        .notification.info {
            border-left: 4px solid #4a6cf7;
        }
        
        .notification.info i {
            color: #4a6cf7;
        }
        
        .mini-cart__item {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
            position: relative;
        }
        
        .mini-cart__item .item-image {
            width: 60px;
            height: 60px;
            overflow: hidden;
            border-radius: 4px;
            margin-right: 12px;
        }
        
        .mini-cart__item .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .mini-cart__item .item-details {
            flex: 1;
        }
        
        .mini-cart__item .item-details h4 {
            margin: 0 0 5px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
        }
        
        .mini-cart__item .item-price {
            font-size: 13px;
            color: #4a5568;
        }
        
        .mini-cart__item .item-remove {
            color: #a0aec0;
            cursor: pointer;
            font-size: 12px;
            position: absolute;
            right: 0;
            top: 10px;
        }
        
        .mini-cart__item .item-remove:hover {
            color: #e53e3e;
        }
        
        .dark-mode .notification {
            background-color: #1a202c;
            color: #e2e8f0;
        }
    `;
    document.head.appendChild(style);
})();