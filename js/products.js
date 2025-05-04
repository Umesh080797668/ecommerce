/**
 * ShopVerse E-commerce Platform
 * Products Management Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initProducts();
});

/**
 * Initialize Products Functionality
 */
function initProducts() {
    // This would typically load products from an API
    // For this demo, we'll use static data that's already in the HTML

    // Initialize wishlist functionality
    initWishlist();

    // Initialize compare functionality
    initCompare();

    // Initialize sorting and filtering (if on product list pages)
    initProductFiltering();
}

/**
 * Initialize Wishlist Functionality
 */
function initWishlist() {
    // Retrieve wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('shopverse-wishlist')) || [];

    // Update wishlist count
    updateWishlistCount();

    // Add click event to wishlist buttons
    const wishlistButtons = document.querySelectorAll('.quick-action-btn.wishlist');

    wishlistButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');

        // Set active state if in wishlist
        if (wishlist.includes(productId)) {
            button.classList.add('active');
        }

        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.getAttribute('data-product-id');

            if (wishlist.includes(productId)) {
                // Remove from wishlist
                wishlist = wishlist.filter(id => id !== productId);
                button.classList.remove('active');
                showNotification('Product removed from wishlist', 'info');
            } else {
                // Add to wishlist
                wishlist.push(productId);
                button.classList.add('active');
                showNotification('Product added to wishlist!', 'success');
            }

            // Save to localStorage
            localStorage.setItem('shopverse-wishlist', JSON.stringify(wishlist));

            // Update count
            updateWishlistCount();
        });
    });

    /**
     * Update wishlist count in header
     */
    function updateWishlistCount() {
        const wishlistCount = document.querySelector('.action__item.wishlist .count');

        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
    }
}

/**
 * Initialize Compare Functionality
 */
function initCompare() {
    // Retrieve compare list from localStorage
    let compareList = JSON.parse(localStorage.getItem('shopverse-compare')) || [];

    // Maximum number of products to compare
    const maxCompare = 4;

    // Add click event to compare buttons
    const compareButtons = document.querySelectorAll('.quick-action-btn.compare');

    compareButtons.forEach(button => {
        const productId = button.getAttribute('data-product-id');

        // Set active state if in compare list
        if (compareList.includes(productId)) {
            button.classList.add('active');
        }

        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.getAttribute('data-product-id');

            if (compareList.includes(productId)) {
                // Remove from compare
                compareList = compareList.filter(id => id !== productId);
                button.classList.remove('active');
                showNotification('Product removed from compare list', 'info');
            } else {
                // Check if compare list is full
                if (compareList.length >= maxCompare) {
                    showNotification(`You can only compare up to ${maxCompare} products`, 'error');
                    return;
                }

                // Add to compare
                compareList.push(productId);
                button.classList.add('active');
                showNotification('Product added to compare list!', 'success');
            }

            // Save to localStorage
            localStorage.setItem('shopverse-compare', JSON.stringify(compareList));
        });
    });
}

/**
 * Initialize Product Filtering and Sorting
 */
function initProductFiltering() {
    // This would be expanded in a real application with more filtering options

    // Sort by select
    const sortSelect = document.getElementById('sort-products');

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const value = this.value;
            sortProducts(value);
        });
    }

    /**
     * Sort products
     * @param {string} sortBy - Sorting criteria
     */
    function sortProducts(sortBy) {
        const productsContainer = document.querySelector('.products-grid');

        if (!productsContainer) return;

        // Get all product cards
        const products = Array.from(productsContainer.querySelectorAll('.product-card'));

        // Sort products
        products.sort((a, b) => {
            switch (sortBy) {
                case 'price-low-high':
                    return getPrice(a) - getPrice(b);
                case 'price-high-low':
                    return getPrice(b) - getPrice(a);
                case 'name-a-z':
                    return getName(a).localeCompare(getName(b));
                case 'name-z-a':
                    return getName(b).localeCompare(getName(a));
                default:
                    return 0;
            }
        });

        // Re-append products in sorted order
        products.forEach(product => {
            productsContainer.appendChild(product);
        });

        // Helper function to get product price
        function getPrice(productElement) {
            const priceElement = productElement.querySelector('.price');
            return priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;
        }

        // Helper function to get product name
        function getName(productElement) {
            const nameElement = productElement.querySelector('.product-title a');
            return nameElement ? nameElement.textContent : '';
        }
    }
}

/**
 * Show notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element if doesn't exist
    if (!document.querySelector('.notification')) {
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
    } else {
        // Update existing notification
        const notification = document.querySelector('.notification');
        notification.className = `notification ${type}`;
        notification.querySelector('i').className = `fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`;
        notification.querySelector('p').textContent = message;
    }
}

/**
 * Add styles for product functionality
 */
(function addProductStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .quick-action-btn.active {
            background-color: var(--primary-color);
            color: var(--white);
        }
        
        .quick-action-btn.wishlist.active {
            background-color: #e53e3e;
        }
        
        .product-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background-color: var(--primary-color);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            z-index: 1;
        }
        
        .product-badge.sale {
            background-color: #e53e3e;
        }
        
        .product-badge.out-of-stock {
            background-color: #718096;
        }
    `;
    document.head.appendChild(style);
})();