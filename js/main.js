/**
 * ShopVerse E-commerce Platform
 * Main JavaScript File
 * @version 1.0.0
 * @author ShopVerse Development Team
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initMobileMenu();
    initHeroSlider();
    initProductFilter();
    initProductCarousel();
    initTestimonialCarousel();
    initCountdown();
    initBackToTop();
    initQuickView();

    // Initialize custom components
    init3DBackground();
});

/**
 * Preloader functionality
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');

    // Hide the preloader after a delay
    setTimeout(() => {
        preloader.classList.add('hide');

        // Remove from DOM after transition
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
}

/**
 * Mobile Menu functionality
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuClose = document.querySelector('.mobile-menu__close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileDropdownItems = document.querySelectorAll('.mobile-nav__item.has-dropdown');

    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Toggle mobile dropdown
    if (mobileDropdownItems.length) {
        mobileDropdownItems.forEach(item => {
            const link = item.querySelector('a');
            const dropdown = item.querySelector('.mobile-dropdown');

            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });
        });
    }
}

/**
 * Hero Slider functionality
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let interval;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show the current slide and activate its dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    // Initialize slider
    if (slides.length && dots.length) {
        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(interval);
                showSlide(index);
                startAutoSlide();
            });
        });

        // Auto-slide function
        function startAutoSlide() {
            interval = setInterval(() => {
                let nextSlide = (currentSlide + 1) % slides.length;
                showSlide(nextSlide);
            }, 5000);
        }

        // Start auto sliding
        startAutoSlide();
    }
}

/**
 * Product Filter functionality
 */
function initProductFilter() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');

    // Filter products based on category
    if (filterTabs.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                filterTabs.forEach(t => {
                    t.classList.remove('active');
                });

                // Add active class to clicked tab
                tab.classList.add('active');

                // Get filter category
                const filter = tab.getAttribute('data-filter');

                // Show/hide products based on filter
                productCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Product Carousel functionality
 */
function initProductCarousel() {
    const carousel = document.querySelector('.products-carousel .scrollable');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');

    if (carousel && nextBtn && prevBtn) {
        // Next button click
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        // Previous button click
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Testimonial Carousel functionality
 */
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentTestimonial = 0;
    let interval;

    // Function to show a specific testimonial
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show the current testimonial and activate its dot
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    // Initialize carousel
    if (testimonials.length && dots.length) {
        // Add click event to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(interval);
                showTestimonial(index);
                startAutoSlide();
            });
        });

        // Auto-slide function
        function startAutoSlide() {
            interval = setInterval(() => {
                let nextTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(nextTestimonial);
            }, 5000);
        }

        // Start auto sliding
        startAutoSlide();
    }
}

/**
 * Countdown Timer functionality
 */
function initCountdown() {
    const daysElement = document.querySelector('.countdown-value.days');
    const hoursElement = document.querySelector('.countdown-value.hours');
    const minutesElement = document.querySelector('.countdown-value.minutes');
    const secondsElement = document.querySelector('.countdown-value.seconds');

    if (daysElement && hoursElement && minutesElement && secondsElement) {
        // Set the countdown date (7 days from current date)
        const now = new Date();
        const countdownDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            // Calculate days, hours, minutes, and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update elements
            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');

            // If countdown is over
            if (distance < 0) {
                clearInterval(countdownInterval);
                daysElement.textContent = '00';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
            }
        }

        // Initial update
        updateCountdown();

        // Update every second
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
}

/**
 * Back to Top button functionality
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Show button when scrolling down
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        // Scroll to top on click
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Quick View Modal functionality
 */
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const modal = document.getElementById('quickViewModal');
    const modalContent = document.querySelector('.quick-view-content');
    const closeModal = document.querySelector('.close-modal');

    if (quickViewButtons.length && modal && modalContent && closeModal) {
        // Open modal when clicking Quick View button
        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                // Get product ID from data attribute
                const productId = button.getAttribute('data-product-id');

                // Fetch product data (in a real app, this would be an API call)
                const productData = getProductData(productId);

                // Populate modal content
                modalContent.innerHTML = generateQuickViewHTML(productData);

                // Show the modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close modal when clicking the X button
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Mock function to get product data by ID
    function getProductData(id) {
        // This would be replaced with an API call in a real app
        const products = {
            '1': {
                name: 'Wireless Noise Cancelling Headphones',
                price: 249.99,
                oldPrice: null,
                rating: 4.5,
                reviews: 42,
                category: 'Electronics',
                image: 'https://via.placeholder.com/500',
                description: 'Experience premium audio with these wireless noise cancelling headphones. Featuring advanced noise cancellation technology, premium sound quality, and long-lasting battery life.',
                features: [
                    'Active Noise Cancellation',
                    'Up to 30 hours battery life',
                    'Premium sound quality',
                    'Comfortable over-ear design',
                    'Built-in microphone for calls'
                ],
                availability: 'In Stock',
                sku: 'WH-1000XM5'
            },
            // Add more products as needed
        };

        // Return the product data or a default one if not found
        return products[id] || {
            name: 'Product Name',
            price: 99.99,
            oldPrice: null,
            rating: 5,
            reviews: 10,
            category: 'Category',
            image: 'https://via.placeholder.com/500',
            description: 'Product description goes here.',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            availability: 'In Stock',
            sku: 'SKU123'
        };
    }

    // Generate HTML for quick view modal
    function generateQuickViewHTML(product) {
        return `
            <div class="quick-view-layout">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-info">
                    <h2 class="product-title">${product.name}</h2>
                    
                    <div class="product-rating">
                        ${generateRatingStars(product.rating)}
                        <span>(${product.reviews} reviews)</span>
                    </div>
                    
                    <div class="product-price">
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
                        <span class="price">$${product.price}</span>
                    </div>
                    
                    <div class="product-description">
                        <p>${product.description}</p>
                    </div>
                    
                    <div class="product-features">
                        <h4>Key Features:</h4>
                        <ul>
                            ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <span class="meta-label">Availability:</span>
                            <span class="meta-value">${product.availability}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Category:</span>
                            <span class="meta-value">${product.category}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">SKU:</span>
                            <span class="meta-value">${product.sku}</span>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <div class="quantity">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" max="99">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        
                        <button class="btn btn-primary add-to-cart">Add to Cart</button>
                        <button class="btn btn-outline wishlist">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate HTML for star ratings
    function generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
}

/**
 * Initialize 3D Background
 */
function init3DBackground() {
    const scene = document.querySelector('.scene');
    
    if (scene) {
        // Create and add 3D elements
        for (let i = 0; i < 30; i++) {
            const element = document.createElement('div');
            element.className = 'scene-element';
            
            // Random position
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = 10 + Math.random() * 40;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            
            // Random shape (circle or square)
            element.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            // Random depth (z-index)
            const depth = Math.floor(Math.random() * 10);
            element.style.zIndex = depth;
            
            // Random opacity based on depth
            element.style.opacity = 0.1 + (depth / 10) * 0.2;
            
            // Random color based on primary color
            const hue = 220 + Math.random() * 20; // Blue-ish hue
            element.style.backgroundColor = `hsla(${hue}, 80%, 60%, ${0.1 + Math.random() * 0.3})`;
            
            // Random animation delay
            element.style.animationDelay = `${Math.random() * 5}s`;
            
            // Add to scene
            scene.appendChild(element);
        }
    }
}