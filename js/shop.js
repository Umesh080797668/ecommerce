/**
 * ShopVerse E-commerce Platform
 * Shop Pages JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize shop page functionality
    initShopFilters();
    initProductViewToggle();
    initQuickView();
    initSortProducts();
    initMobileFilterSidebar();
    initPriceSlider();
});

/**
 * Initialize Shop Filters
 */
function initShopFilters() {
    // Category filter
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // In a real application, this would filter the products
            // For demo purposes, we'll just show a notification
            const category = this.querySelector('span').textContent;
            showNotification(`Filtering by category: ${category}`, 'info');
        });
    });

    // Brand filter
    const brandCheckboxes = document.querySelectorAll('.brand-filter input[type="checkbox"]');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // In a real application, this would filter the products
            const brand = this.value;
            const isChecked = this.checked;

            if (isChecked) {
                showNotification(`Added filter: ${brand}`, 'info');
            } else {
                showNotification(`Removed filter: ${brand}`, 'info');
            }
        });
    });

    // Rating filter
    const ratingItems = document.querySelectorAll('.rating-item');
    ratingItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all items
            ratingItems.forEach(rating => rating.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // In a real application, this would filter the products
            const stars = this.querySelector('.star-rating').children.length;
            showNotification(`Filtering by ${stars} star ratings and above`, 'info');
        });
    });

    // Color filter
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');

            // In a real application, this would filter the products
            const color = this.getAttribute('data-color');
            if (this.classList.contains('active')) {
                showNotification(`Added color filter: ${color}`, 'info');
            } else {
                showNotification(`Removed color filter: ${color}`, 'info');
            }
        });
    });

    // Apply filters
    const applyFiltersBtn = document.querySelectorAll('.apply-filters-btn');
    applyFiltersBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real application, this would apply all selected filters
            showNotification('Filters applied', 'success');

            // If on mobile, close the filter sidebar
            const mobileSidebar = document.querySelector('.mobile-filter-sidebar');
            if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                mobileSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Clear filters
    const clearFiltersBtn = document.querySelectorAll('.clear-filters-btn');
    clearFiltersBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            // Reset category filters
            categoryItems.forEach(item => item.classList.remove('active'));

            // Reset brand checkboxes
            brandCheckboxes.forEach(checkbox => checkbox.checked = false);

            // Reset rating filters
            ratingItems.forEach(item => item.classList.remove('active'));

            // Reset color buttons
            colorButtons.forEach(button => button.classList.remove('active'));

            // Reset price slider (if using a real slider library)
            // In a real app, you would reset the slider values

            showNotification('All filters cleared', 'info');
        });
    });
}

/**
 * Initialize Product View Toggle (Grid/List)
 */
function initProductViewToggle() {
    const gridBtn = document.querySelector('.view-btn.grid');
    const listBtn = document.querySelector('.view-btn.list');
    const productsGrid = document.querySelector('.products-grid');

    if (!gridBtn || !listBtn || !productsGrid) return;

    gridBtn.addEventListener('click', function() {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        productsGrid.classList.remove('list-view');
        productsGrid.classList.add('grid-view');

        // Store preference in localStorage
        localStorage.setItem('shop-view', 'grid');
    });

    listBtn.addEventListener('click', function() {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        productsGrid.classList.remove('grid-view');
        productsGrid.classList.add('list-view');

        // Store preference in localStorage
        localStorage.setItem('shop-view', 'list');
    });

    // Check if there's a saved preference
    const savedView = localStorage.getItem('shop-view');
    if (savedView === 'list') {
        listBtn.click();
    } else {
        gridBtn.click();
    }
}

/**
 * Initialize Quick View Modal
 */
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const modal = document.getElementById('quickViewModal');
    const closeModal = document.querySelectorAll('.close-modal');

    if (!modal) return;

    // Open modal on quick view button click
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            const productId = this.getAttribute('data-product-id');

            // In a real application, this would fetch product details by ID
            // For demo purposes, we'll just show the modal

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal on close button click
    closeModal.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle thumbnail clicks in quick view
    const thumbnails = document.querySelectorAll('.thumbnails img');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');

            // Update main image
            const mainImage = document.querySelector('.main-image img');
            if (mainImage) {
                mainImage.src = this.src;
            }
        });
    });

    // Handle quantity buttons in quick view
    const quantityMinusBtn = document.querySelector('.quantity-btn.minus');
    const quantityPlusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-selector input');

    if (quantityMinusBtn && quantityPlusBtn && quantityInput) {
        quantityMinusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        quantityPlusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });

        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }

    // Handle color selection in quick view
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
}

/**
 * Initialize Product Sorting
 */
function initSortProducts() {
    const sortSelect = document.getElementById('sort-products');

    if (!sortSelect) return;

    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;

        // In a real application, this would sort the products
        // For demo purposes, we'll just show a notification

        let sortText;
        switch (sortBy) {
            case 'price-low':
                sortText = 'Price: Low to High';
                break;
            case 'price-high':
                sortText = 'Price: High to Low';
                break;
            case 'name-asc':
                sortText = 'Name: A-Z';
                break;
            case 'name-desc':
                sortText = 'Name: Z-A';
                break;
            default:
                sortText = 'Latest Products';
        }

        showNotification(`Products sorted by: ${sortText}`, 'info');
    });
}

/**
 * Initialize Mobile Filter Sidebar
 */
function initMobileFilterSidebar() {
    const filterToggle = document.querySelector('.filter-toggle');
    const mobileSidebar = document.querySelector('.mobile-filter-sidebar');
    const closeFilter = document.querySelector('.close-filter');

    if (!filterToggle || !mobileSidebar || !closeFilter) return;

    // Clone desktop filter widgets to mobile sidebar
    const desktopWidgets = document.querySelectorAll('.shop-sidebar .filter-widget');
    const mobileFilterBody = document.querySelector('.mobile-filter-body');

    if (desktopWidgets.length && mobileFilterBody) {
        desktopWidgets.forEach(widget => {
            const clone = widget.cloneNode(true);
            mobileFilterBody.appendChild(clone);
        });

        // Re-initialize event listeners for the cloned elements
        initMobileFilterEvents();
    }

    // Toggle mobile filter sidebar
    filterToggle.addEventListener('click', function() {
        mobileSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close mobile filter sidebar
    closeFilter.addEventListener('click', function() {
        mobileSidebar.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileSidebar.classList.contains('active') &&
            !mobileSidebar.contains(e.target) &&
            !filterToggle.contains(e.target)) {
            mobileSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Initialize Mobile Filter Events
 */
function initMobileFilterEvents() {
    // This would re-initialize events for the cloned filter elements in the mobile sidebar
    // For simplicity, we're not implementing this fully, as it would duplicate a lot of code
}

/**
 * Initialize Price Slider
 * This is a simplified version. In a real application, you might use a library like noUiSlider
 */
function initPriceSlider() {
    // This is a placeholder function
    // In a real application, you would initialize a proper range slider
    console.log('Price slider would be initialized here');
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if there's an existing notification function from cart.js
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