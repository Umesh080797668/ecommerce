/**
 * ShopVerse E-commerce Platform
 * Wishlist Functionality
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    initWishlist();
});

/**
 * Initialize Wishlist
 */
function initWishlist() {
    // Retrieve wishlist from localStorage or initialize empty wishlist
    let wishlist = JSON.parse(localStorage.getItem('shopverse-wishlist')) || [];

    // Initialize UI
    updateWishlistUI();
    updateWishlistCount();

    // Add event listeners for "Add to Wishlist" buttons throughout the site
    const wishlistButtons = document.querySelectorAll('.quick-action-btn.wishlist');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.getAttribute('data-product-id');

            // Toggle wishlist for this product
            toggleWishlistItem(productId);
        });
    });

    // Event delegation for wishlist page actions
    document.addEventListener('click', function(e) {
        // Remove from wishlist
        if (e.target.closest('.remove-from-wishlist')) {
            const button = e.target.closest('.remove-from-wishlist');
            const productId = button.getAttribute('data-product-id');
            removeFromWishlist(productId);
        }

        // Add to cart from wishlist
        if (e.target.closest('.add-to-cart-from-wishlist')) {
            const button = e.target.closest('.add-to-cart-from-wishlist');
            const productId = button.getAttribute('data-product-id');
            addToCartFromWishlist(productId);
        }

        // Clear wishlist
        if (e.target.closest('#clear-wishlist')) {
            clearWishlist();
        }

        // Add all to cart
        if (e.target.closest('#add-all-to-cart')) {
            addAllToCart();
        }
    });

    /**
     * Toggle item in wishlist
     * @param {string} productId - ID of the product to toggle
     */
    function toggleWishlistItem(productId) {
        const index = wishlist.findIndex(item => item.id === productId);
        const productData = getProductById(productId);

        if (index === -1 && productData) {
            // Add to wishlist
            wishlist.push(productData);
            updateWishlistStorage();
            showNotification('Product added to wishlist!', 'success');
        } else {
            // Remove from wishlist
            wishlist.splice(index, 1);
            updateWishlistStorage();
            showNotification('Product removed from wishlist', 'info');
        }

        // Update UI
        updateWishlistCount();

        // Update button state if on product page
        const button = document.querySelector(`.quick-action-btn.wishlist[data-product-id="${productId}"]`);
        if (button) {
            if (index === -1) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        }
    }

    /**
     * Remove item from wishlist
     * @param {string} productId - ID of the product to remove
     */
    function removeFromWishlist(productId) {
        wishlist = wishlist.filter(item => item.id !== productId);
        updateWishlistStorage();
        updateWishlistUI();
        showNotification('Product removed from wishlist', 'info');
    }

    /**
     * Add wishlist item to cart
     * @param {string} productId - ID of the product to add to cart
     */
    function addToCartFromWishlist(productId) {
        const product = wishlist.find(item => item.id === productId);

        if (product) {
            // Add to cart (using cart.js functionality)
            try {
                // This assumes your cart.js exports or has a global addToCart function
                // If not, you'll need to implement it here
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });

                showNotification('Product added to cart!', 'success');

                // Animate the button
                const button = document.querySelector(`.add-to-cart-from-wishlist[data-product-id="${productId}"]`);
                if (button) {
                    button.classList.add('add-to-cart-animation');
                    setTimeout(() => button.classList.remove('add-to-cart-animation'), 500);
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification('Error adding to cart. Please try again.', 'error');
            }
        }
    }

    /**
     * Clear entire wishlist
     */
    function clearWishlist() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to clear your wishlist?')) {
            wishlist = [];
            updateWishlistStorage();
            updateWishlistUI();
            showNotification('Wishlist cleared', 'info');
        }
    }

    /**
     * Add all wishlist items to cart
     */
    function addAllToCart() {
        if (wishlist.length === 0) {
            showNotification('Your wishlist is empty', 'info');
            return;
        }

        let successCount = 0;

        wishlist.forEach(product => {
            try {
                // Add to cart (using cart.js functionality)
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                successCount++;
            } catch (error) {
                console.error('Error adding product to cart:', error);
            }
        });

        if (successCount > 0) {
            showNotification(`${successCount} products added to cart!`, 'success');
        } else {
            showNotification('Error adding products to cart', 'error');
        }
    }

    /**
     * Update wishlist count in header
     */
    function updateWishlistCount() {
        const wishlistCount = document.querySelectorAll('.action__item.wishlist .count');
        wishlistCount.forEach(counter => {
            counter.textContent = wishlist.length;
        });
    }

    /**
     * Update wishlist UI on the wishlist page
     */
    function updateWishlistUI() {
        const wishlistItems = document.getElementById('wishlist-items');
        const wishlistEmptyEl = document.querySelector('.wishlist-empty');
        const wishlistContainer = document.querySelector('.wishlist-container');

        if (!wishlistItems) return;

        // Clear current items
        wishlistItems.innerHTML = '';

        // If wishlist is empty
        if (wishlist.length === 0) {
            if (wishlistEmptyEl) wishlistEmptyEl.style.display = 'block';
            if (wishlistContainer) wishlistContainer.style.display = 'none';
            return;
        }

        // Show wishlist and hide empty state
        if (wishlistEmptyEl) wishlistEmptyEl.style.display = 'none';
        if (wishlistContainer) wishlistContainer.style.display = 'block';

        // Render each wishlist item
        wishlist.forEach(item => {
                    const wishlistItem = document.createElement('div');
                    wishlistItem.className = 'wishlist-item';

                    // Determine stock status randomly for demo (in a real app, you'd get this from an API)
                    const isInStock = Math.random() > 0.2;

                    wishlistItem.innerHTML = `
                <div class="row">
                    <div class="col-product">
                        <div class="product-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="product-info">
                            <h4><a href="product-detail.html?id=${item.id}">${item.name}</a></h4>
                            <div class="product-category">${item.category || 'Uncategorized'}</div>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>(${Math.floor(Math.random() * 100)})</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-price" data-label="Price">
                        <div class="product-price">$${item.price.toFixed(2)}</div>
                    </div>
                    
                    <div class="col-stock" data-label="Stock Status">
                        <div class="stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}">
                            ${isInStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                    </div>
                    
                    <div class="col-actions">
                        <div class="action-buttons">
                            ${isInStock ? 
                              `<button class="btn btn-primary add-to-cart-from-wishlist" data-product-id="${item.id}">
                                  <i class="fas fa-shopping-cart"></i> Add to Cart
                               </button>` : 
                              `<button class="btn btn-outline" disabled>
                                  <i class="fas fa-bell"></i> Notify Me
                               </button>`
                            }
                            <button class="btn btn-outline btn-icon remove-from-wishlist" data-product-id="${item.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            wishlistItems.appendChild(wishlistItem);
        });
    }
    
    /**
     * Update wishlist in localStorage
     */
    function updateWishlistStorage() {
        localStorage.setItem('shopverse-wishlist', JSON.stringify(wishlist));
    }
    
    /**
     * Get product data by ID (mock data for demo)
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
            },
            '6': {
                id: '6',
                name: 'Fitness Tracker Pro',
                price: 89.99,
                image: 'https://via.placeholder.com/300',
                category: 'Electronics'
            },
            '7': {
                id: '7',
                name: 'Designer Polarized Sunglasses',
                price: 159.99,
                image: 'https://via.placeholder.com/300',
                category: 'Fashion'
            },
            '8': {
                id: '8',
                name: 'Advanced Air Purifier',
                price: 149.99,
                image: 'https://via.placeholder.com/300',
                category: 'Home & Furniture'
            }
        };
        
        return products[productId] || null;
    }
    
    /**
     * Show notification message
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
    
    // Check if we're on the wishlist page by looking for wishlist-container element
    const isWishlistPage = document.querySelector('.wishlist-container') !== null;
    
    if (isWishlistPage) {
        // Load recently viewed products (if any)
        loadRecentlyViewedProducts();
    }
    
    /**
     * Load recently viewed products
     * This would normally be stored in localStorage or fetched from server
     */
    function loadRecentlyViewedProducts() {
        const recentlyViewedContainer = document.querySelector('.recently-viewed-section .products-grid');
        if (!recentlyViewedContainer) return;
        
        // For demo, we'll show some random products
        const sampleProducts = [2, 5, 7, 4, 6].map(getProductById).filter(Boolean);
        
        if (sampleProducts.length === 0) {
            document.querySelector('.recently-viewed-section').style.display = 'none';
            return;
        }
        
        // Clear container
        recentlyViewedContainer.innerHTML = '';
        
        // Add sample products
        sampleProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-thumb">
                    <a href="product-detail.html">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <div class="product-quick-actions">
                        <a href="#" class="quick-action-btn quick-view" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i>
                        </a>
                        <a href="#" class="quick-action-btn wishlist ${wishlist.some(item => item.id === product.id) ? 'active' : ''}" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </a>
                        <a href="#" class="quick-action-btn compare" data-product-id="${product.id}">
                            <i class="fas fa-sync-alt"></i>
                        </a>
                    </div>
                    <a href="#" class="add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </a>
                </div>
                <div class="product-content">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">
                        <a href="product-detail.html">${product.name}</a>
                    </h3>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>(${Math.floor(Math.random() * 100)})</span>
                    </div>
                    <div class="product-price">
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                </div>
            `;
            
            recentlyViewedContainer.appendChild(productCard);
        });
        
        // Initialize carousel navigation
        initRecentlyViewedCarousel();
    }
    
    /**
     * Initialize recently viewed carousel
     */
    function initRecentlyViewedCarousel() {
        const container = document.querySelector('.recently-viewed-section .products-grid');
        const prevBtn = document.querySelector('.recently-viewed-section .carousel-prev');
        const nextBtn = document.querySelector('.recently-viewed-section .carousel-next');
        
        if (!container || !prevBtn || !nextBtn) return;
        
        // Set scroll amount for each click (in pixels)
        const scrollAmount = 300;
        
        prevBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', () => {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    }
}

// Add to Cart function fallback (in case cart.js doesn't provide one)
function addToCart(product) {
    if (typeof window.addToCart === 'function') {
        // Use the global function if available
        window.addToCart(product);
    } else {
        // Fallback implementation
        let cart = JSON.parse(localStorage.getItem('shopverse-cart')) || [];
        
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
        
        // Update cart count in UI
        const cartCount = document.querySelectorAll('.action__item.cart .count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartCount.forEach(counter => {
            counter.textContent = totalItems;
        });
    }
}