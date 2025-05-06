/**
 * ShopVerse E-commerce Platform
 * Brands Pages JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-06
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize brands page components
    initBrandFilter();
    initAlphabetFilter();
    initPremiumBrands();
    initTrendingBrandsStats();
    initBrandCarousel();
    init3dEffects();
    initTrendingFilters();
});

/**
 * Initialize Brand Filter
 */
function initBrandFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab, .premium-tab');
    const brandCards = document.querySelectorAll('.brand-card, .premium-product-card');

    if (filterTabs.length && brandCards.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                filterTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');

                // Get filter value
                const filter = this.getAttribute('data-filter') || this.getAttribute('data-category');

                // Filter cards
                brandCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        // Show card with animation
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';

                        // Animate in
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        // Hide card
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Initialize Alphabet Filter
 */
function initAlphabetFilter() {
    const letterBtns = document.querySelectorAll('.alphabet-filter .letter');
    const letterGroups = document.querySelectorAll('.brand-letter-group');

    if (letterBtns.length && letterGroups.length) {
        letterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                letterBtns.forEach(b => b.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const letter = this.getAttribute('data-letter');

                if (letter === 'all') {
                    // Show all letter groups
                    letterGroups.forEach(group => {
                        group.style.display = 'block';
                    });
                } else {
                    // Show only the selected letter group
                    letterGroups.forEach(group => {
                        if (group.id === letter) {
                            group.style.display = 'block';

                            // Scroll to the letter group
                            window.scrollTo({
                                top: group.offsetTop - 100,
                                behavior: 'smooth'
                            });
                        } else {
                            group.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
}

/**
 * Initialize Premium Brands Features
 */
function initPremiumBrands() {
    // Hero Section Parallax Effect
    const heroSection = document.querySelector('.premium-hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;

            // Get hero background for parallax effect
            const heroBackground = heroSection.querySelector('.hero-3d-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrollPosition * 0.15}px)`;
            }
        });
    }

    // Premium Product Hover Effect
    const premiumProducts = document.querySelectorAll('.premium-product-card');
    premiumProducts.forEach(product => {
        product.addEventListener('mouseenter', function() {
            if (window.innerWidth <= 768 || !isEffectsEnabled()) return;

            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 30px rgba(0, 0, 0, 0.1)';

            const productImage = this.querySelector('.product-thumb img');
            if (productImage) {
                productImage.style.transform = 'scale(1.05)';
            }
        });

        product.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';

            const productImage = this.querySelector('.product-thumb img');
            if (productImage) {
                productImage.style.transform = 'scale(1)';
            }
        });
    });

    // Magazine Article Hover Effect
    const magazineArticles = document.querySelectorAll('.magazine-article');
    magazineArticles.forEach(article => {
        article.addEventListener('mouseenter', function() {
            if (!isEffectsEnabled()) return;

            const articleImage = this.querySelector('.article-image img');
            if (articleImage) {
                articleImage.style.transform = 'scale(1.05)';
            }
        });

        article.addEventListener('mouseleave', function() {
            const articleImage = this.querySelector('.article-image img');
            if (articleImage) {
                articleImage.style.transform = 'scale(1)';
            }
        });
    });
}

/**
 * Initialize Trending Brands Stats Counter
 */
function initTrendingBrandsStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (!statNumbers.length) return;

    const isInViewport = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const animateCounter = function(element) {
        // Get target number from data-count attribute
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const stepSize = target / totalSteps;
        let current = 0;

        // Clear any existing timer
        clearInterval(element.timer);

        // Start counter animation
        element.timer = setInterval(function() {
            current += stepSize;

            // Update displayed value
            element.textContent = Math.round(current).toLocaleString();

            // Stop when target is reached
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(element.timer);
            }
        }, stepTime);
    };

    // Check if stats are visible on page load
    statNumbers.forEach(stat => {
        if (isInViewport(stat)) {
            animateCounter(stat);
        }
    });

    // Check visibility on scroll
    window.addEventListener('scroll', function() {
        statNumbers.forEach(stat => {
            if (!stat.classList.contains('animated') && isInViewport(stat)) {
                stat.classList.add('animated');
                animateCounter(stat);
            }
        });
    });
}

/**
 * Initialize Brand Carousels
 */
function initBrandCarousel() {
    const carousels = document.querySelectorAll('.premium-brands-carousel, .rising-stars-slider');

    carousels.forEach(carousel => {
        const scrollable = carousel.querySelector('.scrollable');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');

        if (!scrollable || !prevBtn || !nextBtn) return;

        // Calculate scroll amount based on item width + margin
        const scrollAmount = 300; // approximate width of one item

        // Previous button click
        prevBtn.addEventListener('click', function() {
            scrollable.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Next button click
        nextBtn.addEventListener('click', function() {
            scrollable.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Track scroll position for button visibility
        scrollable.addEventListener('scroll', function() {
            // Check if at beginning or end of scrollable area
            const isAtStart = scrollable.scrollLeft === 0;
            const isAtEnd = scrollable.scrollLeft + scrollable.clientWidth >= scrollable.scrollWidth - 10;

            // Update button state (optional visual feedback)
            prevBtn.classList.toggle('disabled', isAtStart);
            nextBtn.classList.toggle('disabled', isAtEnd);
        });

        // Trigger initial scroll event to set button states
        scrollable.dispatchEvent(new Event('scroll'));
    });
}

/**
 * Initialize 3D Effects for Brand Pages
 */
function init3dEffects() {
    // 3D Card Effect for brand cards
    const cards = document.querySelectorAll('.brand-card, .collection-card, .premium-brand');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            // Check if effects should be disabled
            if (window.innerWidth <= 768 || !isEffectsEnabled()) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Limit rotation to max 5 degrees
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // Hero scene elements for premium and trending pages
    const premiumHero = document.querySelector('.premium-hero-section .scene');
    const trendingHero = document.querySelector('.trending-hero-section');

    if (premiumHero) {
        // Add scene elements if not already present
        if (premiumHero.querySelectorAll('.scene-element').length === 0) {
            for (let i = 0; i < 5; i++) {
                const element = document.createElement('div');
                element.className = 'scene-element';
                element.style.zIndex = i + 1;
                element.style.width = `${Math.random() * 40 + 20}px`;
                element.style.height = `${Math.random() * 40 + 20}px`;
                element.style.borderRadius = '50%';
                element.style.left = `${Math.random() * 80 + 10}%`;
                element.style.top = `${Math.random() * 80 + 10}%`;
                premiumHero.appendChild(element);
            }
        }

        // Add 3D movement on mousemove
        window.addEventListener('mousemove', e => {
            if (!isEffectsEnabled()) return;

            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            const elements = premiumHero.querySelectorAll('.scene-element');
            elements.forEach(element => {
                const depth = parseInt(window.getComputedStyle(element).zIndex) || 1;
                const moveX = mouseX * depth * 15;
                const moveY = mouseY * depth * 15;

                element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        });
    }

    if (trendingHero) {
        // Parallax effect on trending hero content
        window.addEventListener('scroll', () => {
            if (!isEffectsEnabled()) return;

            const scrollY = window.pageYOffset;
            const heroContent = trendingHero.querySelector('.trending-hero-content');

            if (heroContent && scrollY < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
            }
        });
    }
}

/**
 * Check if visual effects should be enabled
 * @returns {boolean} Whether effects should be enabled
 */
function isEffectsEnabled() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
    }

    // Check for saved user preference (if implemented)
    const savedPreference = localStorage.getItem('effects-enabled');
    if (savedPreference !== null) {
        return savedPreference === 'true';
    }

    // Default to enabled
    return true;
}

/**
 * Initialize Trending Brands Filters
 */
function initTrendingFilters() {
    const categoryLinks = document.querySelectorAll('.trending-category');

    if (categoryLinks.length) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Subscribe form handling
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get email input
            const emailInput = this.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value) return;

            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Reset form
                emailInput.value = '';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success notification
                showNotification('Thanks for subscribing! You\'ll receive trend updates soon.', 'success');
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
    // Check if there's an existing notification function in other JS files
    if (window.showNotification) {
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
    }, 4000);
}