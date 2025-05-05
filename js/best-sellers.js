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
    initBestSellersHero();
});

function isEffectsEnabled() {
    // Check if user has reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
    }
    // Default to enabled
    return true;
}

function initBestSellersHero() {
    const heroSection = document.querySelector('.bestseller-hero');
    if (!heroSection) return;

    // Create scene container if not exists
    let scene = heroSection.querySelector('.scene');
    if (!scene) {
        scene = document.createElement('div');
        scene.className = 'scene';
        heroSection.insertBefore(scene, heroSection.firstChild);
    }

    // Create scene elements if needed
    const elementsCount = scene.querySelectorAll('.scene-element').length;
    if (elementsCount < 3) {
        // Add scene elements for 3D effect
        for (let i = 0; i < 3; i++) {
            const element = document.createElement('div');
            element.className = 'scene-element';
            element.style.zIndex = i + 1;
            element.style.width = `${Math.random() * 40 + 20}px`;
            element.style.height = `${Math.random() * 40 + 20}px`;
            element.style.borderRadius = '50%';
            element.style.left = `${Math.random() * 80 + 10}%`;
            element.style.top = `${Math.random() * 80 + 10}%`;
            scene.appendChild(element);
        }
    }

    // Add 3D movement effect
    window.addEventListener('mousemove', e => {
        if (window.innerWidth <= 768 || !isEffectsEnabled()) return;

        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        // Get hero content for subtle movement
        const heroContent = heroSection.querySelector('.bestseller-hero__text');
        if (heroContent) {
            heroContent.style.transform = `translate3d(${mouseX * -20}px, ${mouseY * -20}px, 0)`;
        }

        // Move scene elements for depth effect
        const elements = scene.querySelectorAll('.scene-element');
        elements.forEach(element => {
            const depth = parseInt(window.getComputedStyle(element).zIndex) || 1;
            const moveX = mouseX * depth * 15;
            const moveY = mouseY * depth * 15;
            element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });

    const heroTextContainer = heroSection.querySelector('.bestseller-hero__text');
    if (heroTextContainer) {
        heroTextContainer.style.position = 'relative';
        heroTextContainer.style.zIndex = '10'; // Higher z-index to ensure visibility
        heroTextContainer.style.opacity = '1';
        heroTextContainer.style.visibility = 'visible';
    }

    // Fix for hero text visibility
    const heroText = heroSection.querySelectorAll('.bestseller-hero__title, .bestseller-hero__subtitle, .bestseller-hero__stats .stat');
    heroText.forEach(element => {
        element.style.position = 'relative';
        element.style.zIndex = '5';
        element.style.opacity = '1';
        element.style.visibility = 'visible';
    });
}

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