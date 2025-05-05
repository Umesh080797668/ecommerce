/**
 * ShopVerse E-commerce Platform
 * Flash Deals JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    initFlashDealsCountdown();
    initCategoryTabs();
    initDealActions();
    initLoadMore();
});

/**
 * Initialize Flash Deals Countdown
 */
function initFlashDealsCountdown() {
    // Main Banner Countdown
    const days = document.querySelector('.countdown-item .days');
    const hours = document.querySelector('.countdown-item .hours');
    const minutes = document.querySelector('.countdown-item .minutes');
    const seconds = document.querySelector('.countdown-item .seconds');

    if (days && hours && minutes && seconds) {
        // Set end date (3 days from now for demo)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        endDate.setHours(23, 59, 59, 0);

        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);

        function updateCountdown() {
            const now = new Date();
            const timeDiff = endDate - now;

            if (timeDiff <= 0) {
                // Time's up
                days.textContent = '00';
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
                return;
            }

            // Calculate time components
            const daysValue = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hoursValue = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesValue = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsValue = Math.floor((timeDiff % (1000 * 60)) / 1000);

            // Update DOM
            days.textContent = daysValue < 10 ? `0${daysValue}` : daysValue;
            hours.textContent = hoursValue < 10 ? `0${hoursValue}` : hoursValue;
            minutes.textContent = minutesValue < 10 ? `0${minutesValue}` : minutesValue;
            seconds.textContent = secondsValue < 10 ? `0${secondsValue}` : secondsValue;
        }
    }

    // Individual deal countdowns
    const dealCountdowns = document.querySelectorAll('.deal-countdown');

    dealCountdowns.forEach(countdown => {
        // Get end date from data attribute
        const endDateStr = countdown.getAttribute('data-end');
        if (!endDateStr) return;

        const endDate = new Date(endDateStr);
        const countdownMini = countdown.querySelector('.countdown-mini');

        if (!countdownMini) return;

        // Split the countdown-mini into spans for days, hours, minutes, seconds
        const spans = countdownMini.querySelectorAll('span');
        if (spans.length < 4) return;

        // Update this individual countdown
        updateDealCountdown();
        const interval = setInterval(updateDealCountdown, 1000);

        function updateDealCountdown() {
            const now = new Date();
            const timeDiff = endDate - now;

            if (timeDiff <= 0) {
                // Time's up
                clearInterval(interval);
                spans[0].textContent = '00';
                spans[1].textContent = '00';
                spans[2].textContent = '00';
                spans[3].textContent = '00';

                // Add "expired" class to the parent deal card
                const dealCard = countdown.closest('.deal-card');
                if (dealCard) {
                    dealCard.classList.add('expired');
                }

                return;
            }

            // Calculate time components
            const daysValue = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hoursValue = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesValue = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsValue = Math.floor((timeDiff % (1000 * 60)) / 1000);

            // Update spans
            spans[0].textContent = daysValue < 10 ? `0${daysValue}` : daysValue;
            spans[1].textContent = hoursValue < 10 ? `0${hoursValue}` : hoursValue;
            spans[2].textContent = minutesValue < 10 ? `0${minutesValue}` : minutesValue;
            spans[3].textContent = secondsValue < 10 ? `0${secondsValue}` : secondsValue;
        }
    });
}

/**
 * Initialize Category Tabs
 */
function initCategoryTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const dealCards = document.querySelectorAll('.deal-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show/hide deals based on category
            dealCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (category === 'all' || category === cardCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialize Deal Actions (wishlist, quick view)
 */
function initDealActions() {
    // Wishlist Buttons
    const wishlistButtons = document.querySelectorAll('.action-btn.wishlist');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');

            const productId = this.getAttribute('data-product-id');
            const isAdded = this.classList.contains('active');

            // In a real app, this would call the wishlist API or update localStorage
            if (isAdded) {
                showNotification('Product added to wishlist!', 'success');
            } else {
                showNotification('Product removed from wishlist', 'info');
            }
        });
    });

    // Quick View Buttons
    const quickViewButtons = document.querySelectorAll('.action-btn.quick-view');
    const modal = document.getElementById('quickViewModal');

    if (modal && quickViewButtons.length) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');

                // In a real app, this would fetch the product details
                // For demo, we'll just show the modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close button (if exists)
        const closeModal = modal.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }

    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');

            // In a real app, this would call the cart.js addToCart function
            // For demo, we'll just show a notification
            showNotification('Product added to cart!', 'success');

            // Animation
            this.classList.add('adding');
            setTimeout(() => this.classList.remove('adding'), 1000);
        });
    });
}

/**
 * Initialize Load More Button
 */
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more button');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;

            // In a real app, this would load more products from the API
            // For demo, we'll just simulate a delay
            setTimeout(() => {
                // Reset button
                this.innerHTML = 'Load More Deals';
                this.disabled = false;

                // Show notification
                showNotification('All deals have been loaded', 'info');
            }, 1500);
        });
    }
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