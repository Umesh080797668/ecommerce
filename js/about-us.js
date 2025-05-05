/**
 * ShopVerse E-commerce Platform
 * About Us Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize about us page components
    initStatCounters();
    initTestimonialSlider();
    initOfficeMap();
    animateTimeline();
});

/**
 * Initialize stat counters with animation
 */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (!statNumbers.length) return;

    // Check if element is in viewport
    const isInViewport = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Animate counter
    const animateCounter = function(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const stepTime = 20; // Update every 20ms
        const totalSteps = duration / stepTime;
        const stepSize = target / totalSteps;
        let current = 0;
        let timer;

        // Clear any existing timer
        clearInterval(element.timer);

        // Set the timer
        element.timer = setInterval(function() {
            current += stepSize;

            // Round the number and update the element
            const valueToDisplay = Math.round(current);
            element.textContent = valueToDisplay.toLocaleString();

            // Stop the interval when we reach the target
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(element.timer);
            }
        }, stepTime);
    };

    // Check if counters are visible on page load
    statNumbers.forEach(stat => {
        if (isInViewport(stat)) {
            animateCounter(stat);
        }
    });

    // Check visibility on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function() {
            statNumbers.forEach(stat => {
                // Only start animation if not already animated and in viewport
                if (!stat.classList.contains('animated') && isInViewport(stat)) {
                    stat.classList.add('animated');
                    animateCounter(stat);
                }
            });
        }, 100);
    });
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.nav-dot');
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');

    if (!testimonials.length || !dots.length || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    let testimonialInterval;

    // Show initial testimonial
    showTestimonial(currentSlide);

    // Start auto rotation
    startAutoRotation();

    // Previous button click
    prevBtn.addEventListener('click', function() {
        resetAutoRotation();
        goToPrevSlide();
    });

    // Next button click
    nextBtn.addEventListener('click', function() {
        resetAutoRotation();
        goToNextSlide();
    });

    // Dots click
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            resetAutoRotation();
            showTestimonial(index);
        });
    });

    // Show specific testimonial
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });

        // Deactivate all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current testimonial
        testimonials[index].style.display = 'block';

        // Activate current dot
        dots[index].classList.add('active');

        // Update current slide index
        currentSlide = index;
    }

    // Go to previous slide
    function goToPrevSlide() {
        const newIndex = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showTestimonial(newIndex);
    }

    // Go to next slide
    function goToNextSlide() {
        const newIndex = (currentSlide + 1) % testimonials.length;
        showTestimonial(newIndex);
    }

    // Start auto rotation
    function startAutoRotation() {
        testimonialInterval = setInterval(goToNextSlide, 8000); // 8 seconds
    }

    // Reset auto rotation
    function resetAutoRotation() {
        clearInterval(testimonialInterval);
        startAutoRotation();
    }
}

/**
 * Initialize office map interactivity
 */
function initOfficeMap() {
    const mapMarkers = document.querySelectorAll('.map-marker');
    const officeCards = document.querySelectorAll('.office-card');

    if (!mapMarkers.length || !officeCards.length) return;

    // Set New York as default active office
    const defaultLocation = 'new-york';
    setActiveOffice(defaultLocation);

    // Add click event to markers
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            setActiveOffice(location);
        });
    });

    // Add click event to office cards
    officeCards.forEach(card => {
        card.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            setActiveOffice(location);
        });
    });

    /**
     * Set active office
     * @param {string} location - Office location ID
     */
    function setActiveOffice(location) {
        // Remove active class from all cards
        officeCards.forEach(card => {
            card.classList.remove('active');
        });

        // Add active class to selected card
        const selectedCard = document.querySelector(`.office-card[data-location="${location}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');

            // Smooth scroll to office card on mobile
            if (window.innerWidth < 768) {
                selectedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }
}

/**
 * Animate timeline on scroll
 */
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timelineItems.length) return;

    // Check if element is in viewport
    const isInViewport = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    };

    // Initial check on load
    timelineItems.forEach(item => {
        if (isInViewport(item)) {
            item.classList.add('animate');
        }
    });

    // Check on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function() {
            timelineItems.forEach(item => {
                if (isInViewport(item) && !item.classList.contains('animate')) {
                    item.classList.add('animate');
                }
            });
        }, 100);
    });
}