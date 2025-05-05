/**
 * ShopVerse E-commerce Platform
 * Special Offers Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize special offers page components
    initFlashDealCountdown();
    initOfferCountdowns();
    initSpecialOffersFilters();
    initViewToggle();
    initQuickView();
    initPagination();
});

/**
 * Initialize Flash Deal Countdown
 */
function initFlashDealCountdown() {
    const countdownElements = document.querySelectorAll('.flash-deals-header .countdown-value');
    if (!countdownElements.length) return;

    // Set end date to 7 days from now for the main flash deals countdown
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    // Update countdown every second
    updateCountdown(countdownElements, endDate);
    setInterval(() => {
        updateCountdown(countdownElements, endDate);
    }, 1000);
}

/**
 * Initialize Individual Offer Countdowns
 */
function initOfferCountdowns() {
    const offerCountdowns = document.querySelectorAll('.offer-countdown');
    if (!offerCountdowns.length) return;

    // Update each offer countdown
    offerCountdowns.forEach(countdown => {
        const endDateStr = countdown.getAttribute('data-enddate');
        const endDate = new Date(endDateStr);

        // Initial update
        updateOfferCountdown(countdown, endDate);

        // Update counters every minute (to save resources)
        setInterval(() => {
            updateOfferCountdown(countdown, endDate);
        }, 60000); // Every minute
    });
}

/**
 * Update Countdown Timer Elements
 * @param {NodeList} elements - DOM elements for days, hours, minutes, seconds
 * @param {Date} endDate - Countdown end date
 */
function updateCountdown(elements, endDate) {
    const now = new Date();
    const distance = endDate - now;

    // If countdown finished
    if (distance < 0) {
        elements[0].textContent = '00';
        elements[1].textContent = '00';
        elements[2].textContent = '00';
        elements[3].textContent = '00';
        return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update elements
    elements[0].textContent = days < 10 ? '0' + days : days;
    elements[1].textContent = hours < 10 ? '0' + hours : hours;
    elements[2].textContent = minutes < 10 ? '0' + minutes : minutes;
    elements[3].textContent = seconds < 10 ? '0' + seconds : seconds;
}

/**
 * Update Individual Offer Countdown
 * @param {HTMLElement} element - Countdown element
 * @param {Date} endDate - Countdown end date
 */
function updateOfferCountdown(element, endDate) {
    const now = new Date();
    const distance = endDate - now;

    if (distance < 0) {
        element.innerHTML = 'Expired';
        element.style.color = 'var(--danger-color)';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    let displayText = '';
    if (days > 0) {
        displayText = `${days} day${days !== 1 ? 's' : ''}`;
    } else {
        displayText = `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    element.textContent = displayText;
}

/**
 * Initialize Special Offers Filters
 */
function initSpecialOffersFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const discountFilter = document.getElementById('discount-filter');
    const sortFilter = document.getElementById('sort-filter');
    const offerItems = document.querySelectorAll('.offer-item');

    if (!categoryFilter || !discountFilter || !sortFilter) return;

    // Event listeners for filters
    categoryFilter.addEventListener('change', applyFilters);
    discountFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    /**
     * Apply all filters
     */
    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedDiscount = parseInt(discountFilter.value) || 0;
        const selectedSort = sortFilter.value;

        // Convert NodeList to Array for easier filtering and sorting
        const offerItemsArray = Array.from(offerItems);

        // Filter items
        const filteredItems = offerItemsArray.filter(item => {
            const itemCategory = item.getAttribute('data-category');
            const itemDiscount = parseInt(item.getAttribute('data-discount')) || 0;

            const categoryMatch = selectedCategory === 'all' || itemCategory === selectedCategory;
            const discountMatch = selectedDiscount === 0 || itemDiscount >= selectedDiscount;

            return categoryMatch && discountMatch;
        });

        // Sort items
        switch (selectedSort) {
            case 'discount':
                filteredItems.sort((a, b) => {
                    return parseInt(b.getAttribute('data-discount')) - parseInt(a.getAttribute('data-discount'));
                });
                break;
            case 'price-low':
                filteredItems.sort((a, b) => {
                    return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                });
                break;
            case 'price-high':
                filteredItems.sort((a, b) => {
                    return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                });
                break;
            case 'newest':
                filteredItems.sort((a, b) => {
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateB - dateA;
                });
                break;
            case 'popular':
            default:
                // Keep original order, which presumably is by popularity
                break;
        }

        // Hide all items first
        offerItems.forEach(item => {
            item.style.display = 'none';
        });

        // Show filtered and sorted items
        filteredItems.forEach(item => {
            item.style.display = '';
        });

        // Update "no results" message
        updateNoResultsMessage(filteredItems.length === 0);
    }

    /**
     * Show/hide no results message
     * @param {boolean} show - Whether to show the message
     */
    function updateNoResultsMessage(show) {
        // First check if message already exists
        let noResultsMessage = document.querySelector('.no-results-message');

        if (show) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results-message';
                noResultsMessage.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No matching offers found</h3>
                        <p>Try adjusting your filters or browse our other categories.</p>
                        <button class="btn btn-primary reset-filters">Reset Filters</button>
                    </div>
                `;

                const offersContainer = document.getElementById('offers-container');
                offersContainer.appendChild(noResultsMessage);

                // Add event listener to reset button
                noResultsMessage.querySelector('.reset-filters').addEventListener('click', resetFilters);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }

    /**
     * Reset all filters
     */
    function resetFilters() {
        categoryFilter.value = 'all';
        discountFilter.value = 'all';
        sortFilter.value = 'popular';

        applyFilters();
    }
}

/**
 * Initialize Grid/List View Toggle
 */
function initViewToggle() {
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const offersContainer = document.getElementById('offers-container');

    if (!gridViewBtn || !listViewBtn || !offersContainer) return;

    gridViewBtn.addEventListener('click', function() {
        setActiveView('grid');
    });

    listViewBtn.addEventListener('click', function() {
        setActiveView('list');
    });

    function setActiveView(viewType) {
        // Update buttons
        gridViewBtn.classList.toggle('active', viewType === 'grid');
        listViewBtn.classList.toggle('active', viewType === 'list');

        // Update container class
        offersContainer.classList.toggle('list-view', viewType === 'list');

        // Save preference to localStorage
        localStorage.setItem('offers-view-preference', viewType);
    }

    // Check for saved preference
    const savedViewPreference = localStorage.getItem('offers-view-preference');
    if (savedViewPreference === 'list') {
        setActiveView('list');
    }
}

/**
 * Initialize Quick View Modal
 */
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const modal = document.getElementById('quickViewModal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;

    if (!quickViewBtns.length || !modal || !closeBtn) return;

    // Open modal
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Get product ID from button
            const productId = this.getAttribute('data-product-id');
            const productData = getProductDetails(productId);

            if (productData) {
                updateQuickViewModal(productData);
                openModal();
            }
        });
    });

    // Close modal
    closeBtn.addEventListener('click', closeModal);

    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /**
     * Open modal
     */
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    /**
     * Close modal
     */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    /**
     * Update modal with product details
     * @param {Object} product - Product data
     */
    function updateQuickViewModal(product) {
        // Update modal content
        const modalImage = modal.querySelector('.quick-view-image img');
        const modalCategory = modal.querySelector('.product-category');
        const modalTitle = modal.querySelector('.product-title');
        const modalRating = modal.querySelector('.product-rating span');
        const modalOldPrice = modal.querySelector('.old-price');
        const modalPrice = modal.querySelector('.price');
        const modalDescription = modal.querySelector('.product-description');
        const modalSku = modal.querySelector('.meta-item strong:first-child + span');
        const modalAvailability = modal.querySelector('.in-stock');

        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalCategory.textContent = product.category;
        modalTitle.textContent = product.name;
        modalRating.textContent = `(${product.reviews} reviews)`;
        modalOldPrice.textContent = product.oldPrice;
        modalPrice.textContent = product.price;
        modalDescription.textContent = product.description;

        // Reset quantity to 1
        const quantityInput = modal.querySelector('input[type="number"]');
        if (quantityInput) {
            quantityInput.value = 1;
        }
    }

    /**
     * Get product details by ID
     * @param {string} productId - Product ID
     * @returns {Object|null} Product data or null if not found
     */
    function getProductDetails(productId) {
        // In a real app, this would fetch data from an API
        // Using mock data for the demo
        const products = {
            '101': {
                id: '101',
                name: 'Premium Wireless Headphones',
                category: 'Electronics',
                price: '$179.99',
                oldPrice: '$299.99',
                image: '../assets/images/1.jpg',
                description: 'Experience studio-quality sound with these premium noise-cancelling headphones. Features Bluetooth 5.0, 30-hour battery life, and ultra-comfortable ear cushions.',
                reviews: 78,
                sku: 'PH-101010'
            },
            '102': {
                id: '102',
                name: 'Smart Watch Ultra',
                category: 'Electronics',
                price: '$299.99',
                oldPrice: '$399.99',
                image: '../assets/images/1.jpg',
                description: 'Advanced smartwatch with health monitoring, GPS, always-on display, and 5-day battery life. Water-resistant up to 50m and compatible with iOS and Android.',
                reviews: 125,
                sku: 'SW-202020'
            },
            '201': {
                id: '201',
                name: 'Pro Wireless Earbuds',
                category: 'Electronics',
                price: '$129.99',
                oldPrice: '$199.99',
                image: '../assets/images/1.jpg',
                description: 'Premium sound quality with active noise cancellation. Up to 24 hours of battery life with charging case. Water and sweat resistant.',
                reviews: 45,
                sku: 'PWE-303030'
            },
            '202': {
                id: '202',
                name: 'Designer Travel Backpack',
                category: 'Fashion',
                price: '$79.99',
                oldPrice: '$99.99',
                image: '../assets/images/1.jpg',
                description: 'Stylish and functional travel backpack with laptop compartment, water bottle holders, and multiple storage pockets. Made from durable, water-resistant materials.',
                reviews: 37,
                sku: 'DTB-404040'
            },
            '203': {
                id: '203',
                name: 'Smart Touchscreen Blender',
                category: 'Home & Furniture',
                price: '$149.99',
                oldPrice: '$299.99',
                image: '../assets/images/1.jpg',
                description: 'Intelligent blender with touchscreen display and 15 preset programs. Self-cleaning function and quiet operation. Includes recipe book with 50+ recipes.',
                reviews: 89,
                sku: 'STB-505050'
            }
        };

        return products[productId] || null;
    }
}

/**
 * Initialize Pagination
 */
function initPagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.btn-pagination.prev');
    const nextBtn = document.querySelector('.btn-pagination.next');

    if (!pageNumbers.length || !prevBtn || !nextBtn) return;

    // This is a static demo, so we'll just add visual interaction
    let currentPage = 1;
    const totalPages = pageNumbers.length;

    // Set active page
    function setActivePage(pageNum) {
        currentPage = pageNum;

        // Update page numbers
        pageNumbers.forEach((page, index) => {
            page.classList.toggle('active', index + 1 === currentPage);
        });

        // Enable/disable prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // In a real app, this would fetch the next page of results
        console.log(`Loading page ${currentPage}`);

        // Scroll to top of offers section
        const offersSection = document.querySelector('.special-offers-section');
        if (offersSection) {
            offersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Page number click
    pageNumbers.forEach((page, index) => {
        page.addEventListener('click', () => {
            setActivePage(index + 1);
        });
    });

    // Previous button click
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            setActivePage(currentPage - 1);
        }
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            setActivePage(currentPage + 1);
        }
    });
}

/**
 * Show notification message (used when adding to cart, etc)
 * This is a fallback in case cart.js isn't loaded
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if there's an existing showNotification function (from cart.js)
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }

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