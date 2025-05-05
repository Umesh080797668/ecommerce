/**
 * ShopVerse E-commerce Platform
 * Best Sellers Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    initBestSellersTabs();
    initReviewsSlider();
    initSellerCardAnimations();
    initReviewHelpful();
});

/**
 * Initialize Best Sellers Tabs
 */
function initBestSellersTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.bestseller');

    if (filterTabs.length && productCards.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');

                // Filter products
                const filter = this.getAttribute('data-filter');

                productCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';

                        // Add animation class
                        card.classList.add('animate-in');
                        setTimeout(() => {
                            card.classList.remove('animate-in');
                        }, 500);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Initialize Reviews Slider
 */
function initReviewsSlider() {
    const prevBtn = document.querySelector('.reviews-prev');
    const nextBtn = document.querySelector('.reviews-next');
    const dots = document.querySelectorAll('.reviews-dots .dot');
    const reviewCards = document.querySelectorAll('.review-card');

    if (!prevBtn || !nextBtn || !dots.length || !reviewCards.length) return;

    // Set up slider
    let currentSlide = 0;
    const maxSlides = Math.ceil(reviewCards.length / 3); // Show 3 reviews per slide on desktop

    // Initialize - hide all review cards except first slide
    updateSlider();

    // Previous button click
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + maxSlides) % maxSlides;
        updateSlider();
    });

    // Next button click
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % maxSlides;
        updateSlider();
    });

    // Dots click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Update slider state
    function updateSlider() {
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // Show/hide review cards based on screen size and current slide
        const screenWidth = window.innerWidth;
        let cardsPerSlide = 3; // Desktop default

        if (screenWidth < 992) {
            cardsPerSlide = 2; // Tablet
        }

        if (screenWidth < 768) {
            cardsPerSlide = 1; // Mobile
        }

        // Hide all cards
        reviewCards.forEach(card => {
            card.style.display = 'none';
        });

        // Show cards for current slide
        const startIndex = currentSlide * cardsPerSlide;
        const endIndex = Math.min(startIndex + cardsPerSlide, reviewCards.length);

        for (let i = startIndex; i < endIndex; i++) {
            if (reviewCards[i]) {
                reviewCards[i].style.display = 'block';
            }
        }
    }

    // Handle window resize
    window.addEventListener('resize', updateSlider);
}

/**
 * Initialize Seller Card Animations
 */
function initSellerCardAnimations() {
    const sellerCards = document.querySelectorAll('.seller-card');

    if (sellerCards.length) {
        // Add animation classes when they come into view
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // For performance, stop observing after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        };

        // Set up Intersection Observer
        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.2,
            rootMargin: '0px'
        });

        // Observe each seller card
        sellerCards.forEach(card => {
            observer.observe(card);
        });

        // Add hover animations
        sellerCards.forEach(card => {
            card.addEventListener('mouseover', function() {
                const avatar = this.querySelector('.seller-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1.05)';
                    avatar.style.transition = 'transform 0.3s ease';
                }
            });

            card.addEventListener('mouseout', function() {
                const avatar = this.querySelector('.seller-avatar');
                if (avatar) {
                    avatar.style.transform = 'scale(1)';
                }
            });
        });
    }
}

/**
 * Initialize Review Helpful Buttons
 */
function initReviewHelpful() {
    const helpfulBtns = document.querySelectorAll('.btn-helpful');

    if (helpfulBtns.length) {
        helpfulBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Check if already clicked (to prevent multiple clicks)
                if (this.classList.contains('clicked')) return;

                // Get current count
                let text = this.innerHTML;
                let count = parseInt(text.match(/\d+/) || 0);
                let isThumbsUp = text.includes('thumbs-up');

                // Update count and add clicked class
                this.innerHTML = text.replace(/\(\d+\)/, `(${count + 1})`);
                this.classList.add('clicked');

                // Add visual feedback
                this.style.backgroundColor = (--primary - color);
                this.style.color = (--white);

                // If this is "thumbs up", disable the "thumbs down" button in same group and vice versa
                const parentDiv = this.closest('.helpful-buttons');
                if (parentDiv) {
                    const otherBtns = parentDiv.querySelectorAll('.btn-helpful:not(.clicked)');
                    otherBtns.forEach(otherBtn => {
                        otherBtn.classList.add('disabled');
                        otherBtn.disabled = true;
                    });
                }

                // Show notification
                if (isThumbsUp) {
                    showNotification('Thanks for your feedback!', 'success');
                } else {
                    showNotification('Thanks for your feedback!', 'info');
                }
            });
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