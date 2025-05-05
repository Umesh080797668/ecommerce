/**
 * ShopVerse E-commerce Platform
 * Corporate Gift Cards Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize corporate gift cards page components
    initTabs();
    initPricingCalculator();
    initCaseStudiesSlider();
    initFAQToggle();
    initContactForm();
    initFloatingElements();
});

/**
 * Initialize Program Tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding tab pane
            tabPanes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Initialize Pricing Calculator
 */
function initPricingCalculator() {
    const cardQuantityInput = document.getElementById('card-quantity');
    const cardValueInput = document.getElementById('card-value');
    const cardTypeSelect = document.getElementById('card-type');
    const customBrandingCheckbox = document.getElementById('custom-branding');
    const customizationCheckbox = document.getElementById('customization');
    const customPackagingCheckbox = document.getElementById('custom-packaging');
    const customPackagingRow = document.querySelector('.custom-packaging-row');

    // Output elements
    const cardSubtotalElement = document.getElementById('card-subtotal');
    const bulkDiscountElement = document.getElementById('bulk-discount');
    const additionalCostElement = document.getElementById('additional-cost');
    const estimatedTotalElement = document.getElementById('estimated-total');
    const discountPercentageElement = document.getElementById('discount-percentage');

    if (!cardQuantityInput || !cardValueInput || !cardTypeSelect) return;

    // Initial calculation
    updateCalculation();

    // Add event listeners to inputs
    cardQuantityInput.addEventListener('input', updateCalculation);
    cardValueInput.addEventListener('input', updateCalculation);
    cardTypeSelect.addEventListener('change', function() {
        // Show custom packaging option only for physical cards
        if (this.value === 'physical' || this.value === 'custom') {
            customPackagingRow.style.display = 'flex';
        } else {
            customPackagingRow.style.display = 'none';
            customPackagingCheckbox.checked = false;
        }

        updateCalculation();
    });

    // Additional options
    if (customBrandingCheckbox) customBrandingCheckbox.addEventListener('change', updateCalculation);
    if (customizationCheckbox) customizationCheckbox.addEventListener('change', updateCalculation);
    if (customPackagingCheckbox) customPackagingCheckbox.addEventListener('change', updateCalculation);

    /**
     * Update price calculation
     */
    function updateCalculation() {
        // Get values
        let quantity = parseInt(cardQuantityInput.value) || 0;
        let cardValue = parseFloat(cardValueInput.value) || 0;
        let cardType = cardTypeSelect.value;

        // Ensure minimum quantity
        if (quantity < 10) {
            quantity = 10;
            cardQuantityInput.value = 10;
        }

        // Validate card value
        if (cardValue < 10) {
            cardValue = 10;
            cardValueInput.value = 10;
        } else if (cardValue > 1000) {
            cardValue = 1000;
            cardValueInput.value = 1000;
        }

        // Calculate subtotal (quantity * card value)
        const subtotal = quantity * cardValue;

        // Calculate discount percentage based on quantity or subtotal
        let discountPercentage = 0;

        if (quantity >= 500 || subtotal >= 25000) {
            discountPercentage = 15;
        } else if (quantity >= 250 || subtotal >= 12500) {
            discountPercentage = 10;
        } else if (quantity >= 100 || subtotal >= 5000) {
            discountPercentage = 8;
        } else if (quantity >= 50 || subtotal >= 2500) {
            discountPercentage = 5;
        } else if (quantity >= 10 || subtotal >= 500) {
            discountPercentage = 2;
        }

        // Calculate discount amount
        const discountAmount = (subtotal * discountPercentage) / 100;

        // Calculate additional costs
        let additionalCosts = 0;

        // Card type costs
        if (cardType === 'physical') {
            additionalCosts += quantity * 1.5; // $1.50 per physical card
        } else if (cardType === 'custom') {
            additionalCosts += quantity * 2.5; // $2.50 per custom branded card
        }

        // Custom branding setup fee
        if (customBrandingCheckbox && customBrandingCheckbox.checked) {
            additionalCosts += 50;
        }

        // Message customization
        if (customizationCheckbox && customizationCheckbox.checked) {
            additionalCosts += quantity * 0.25;
        }

        // Premium packaging
        if (customPackagingCheckbox && customPackagingCheckbox.checked &&
            (cardType === 'physical' || cardType === 'custom')) {
            additionalCosts += quantity * 1.5;
        }

        // Calculate estimated total
        const estimatedTotal = subtotal - discountAmount + additionalCosts;

        // Update display
        if (cardSubtotalElement) {
            cardSubtotalElement.textContent = formatCurrency(subtotal);
        }

        if (bulkDiscountElement) {
            bulkDiscountElement.textContent = `-${formatCurrency(discountAmount)}`;
        }

        if (additionalCostElement) {
            additionalCostElement.textContent = formatCurrency(additionalCosts);
        }

        if (estimatedTotalElement) {
            estimatedTotalElement.textContent = formatCurrency(estimatedTotal);
        }

        if (discountPercentageElement) {
            discountPercentageElement.textContent = `${discountPercentage}%`;
        }
    }

    /**
     * Format number as currency
     * @param {number} value - Number to format
     * @returns {string} - Formatted currency string
     */
    function formatCurrency(value) {
        return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
}

/**
 * Initialize Case Studies Slider
 */
function initCaseStudiesSlider() {
    const sliderContainer = document.querySelector('.case-studies-slider');
    const slides = document.querySelectorAll('.case-study');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.slider-dot');

    if (!sliderContainer || !slides.length || !prevButton || !nextButton) return;

    // Set initial state
    let currentSlide = 0;

    // Set all slides except the first to display: none
    slides.forEach((slide, index) => {
        if (index !== currentSlide) {
            slide.style.display = 'none';
        }
    });

    // Update slide function
    const updateSlide = (nextSlideIndex) => {
        // Hide current slide
        slides[currentSlide].style.display = 'none';

        // Show next slide
        slides[nextSlideIndex].style.display = 'flex';

        // Update active dot
        if (dots.length) {
            dots[currentSlide].classList.remove('active');
            dots[nextSlideIndex].classList.add('active');
        }

        // Update current slide index
        currentSlide = nextSlideIndex;
    };

    // Next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const nextSlide = (currentSlide + 1) % slides.length;
            updateSlide(nextSlide);
        });
    }

    // Previous button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const prevSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlide(prevSlide);
        });
    }

    // Dots
    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlide(index);
            });
        });
    }

    // Auto advance slides every 8 seconds
    let slideInterval = setInterval(() => {
        const nextSlide = (currentSlide + 1) % slides.length;
        updateSlide(nextSlide);
    }, 8000);

    // Pause auto-advance when interacting with slider
    const pauseAutoAdvance = () => {
        clearInterval(slideInterval);

        // Resume after 20 seconds of inactivity
        slideInterval = setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            updateSlide(nextSlide);
        }, 8000);
    };

    // Add pause events
    nextButton.addEventListener('click', pauseAutoAdvance);
    prevButton.addEventListener('click', pauseAutoAdvance);
    dots.forEach(dot => {
        dot.addEventListener('click', pauseAutoAdvance);
    });
}

/**
 * Initialize FAQ Toggle functionality
 */
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const currentlyActive = item.classList.contains('active');

            // Close other FAQs in the same column
            const parentColumn = item.closest('.faq-column');
            if (parentColumn) {
                const siblingItems = parentColumn.querySelectorAll('.faq-item');
                siblingItems.forEach(siblingItem => {
                    if (siblingItem !== item) {
                        siblingItem.classList.remove('active');
                    }
                });
            }

            // Toggle current FAQ
            item.classList.toggle('active', !currentlyActive);
        });
    });
}

/**
 * Initialize Contact Form
 */
function initContactForm() {
    const contactForm = document.getElementById('corporate-request-form');
    const formConfirmationModal = document.getElementById('formConfirmationModal');
    const modalCloseBtn = document.querySelector('#formConfirmationModal .modal-close');
    const modalConfirmBtn = document.querySelector('.modal-confirm-btn');

    if (!contactForm || !formConfirmationModal) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (validateForm(contactForm)) {
            // In a real application, you would submit the form data to your backend here

            // Generate a random reference number for demonstration
            const referenceNumber = generateReferenceNumber();
            document.getElementById('reference-number').textContent = referenceNumber;

            // Show confirmation modal
            openModal(formConfirmationModal);

            // Reset the form
            contactForm.reset();
        }
    });

    // Close modal on X button click
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            closeModal(formConfirmationModal);
        });
    }

    // Close modal on confirm button click
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            closeModal(formConfirmationModal);
        });
    }

    // Close modal when clicking outside
    formConfirmationModal.addEventListener('click', (e) => {
        if (e.target === formConfirmationModal) {
            closeModal(formConfirmationModal);
        }
    });

    /**
     * Validate contact form
     * @param {HTMLFormElement} form - Form to validate
     * @returns {boolean} - True if form is valid
     */
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                highlightInvalidField(field);
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                highlightInvalidField(field);
            } else if (field.type === 'tel' && !isValidPhone(field.value)) {
                isValid = false;
                highlightInvalidField(field);
            } else {
                field.classList.remove('invalid');
            }
        });

        return isValid;
    }

    /**
     * Highlight an invalid form field
     * @param {HTMLElement} field - Field to highlight
     */
    function highlightInvalidField(field) {
        field.classList.add('invalid');

        // Remove invalid class on input
        field.addEventListener('input', function onInput() {
            field.classList.remove('invalid');
            field.removeEventListener('input', onInput);
        });
    }

    /**
     * Check if email is valid
     * @param {string} email - Email to validate
     * @returns {boolean} - True if email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Check if phone number is valid
     * @param {string} phone - Phone to validate
     * @returns {boolean} - True if phone is valid
     */
    function isValidPhone(phone) {
        // Very basic validation - requires more than 6 digits
        return phone.replace(/\D/g, '').length >= 6;
    }

    /**
     * Generate a reference number
     * @returns {string} - Reference number
     */
    function generateReferenceNumber() {
        const prefix = 'COR-';
        const randomPart = Math.floor(10000000 + Math.random() * 90000000);
        return prefix + randomPart;
    }
}

/**
 * Initialize floating elements animation
 */
function initFloatingElements() {
    const floatingCards = document.querySelectorAll('.floating-card');
    const heroImage = document.querySelector('.corporate-hero-image');

    if (!floatingCards.length || !heroImage) return;

    // Add 3D hover effect to hero image
    heroImage.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = this.getBoundingClientRect();

        // Calculate mouse position relative to the element
        const x = ((e.clientX - left) / width) - 0.5;
        const y = ((e.clientY - top) / height) - 0.5;

        // Apply 3D rotation
        floatingCards.forEach(card => {
            card.style.transform = `
                perspective(1000px)
                rotateY(${x * 15}deg)
                rotateX(${-y * 15}deg)
                translateZ(20px)
                ${card.classList.contains('card1') ? 'rotate(15deg)' : 'rotate(-10deg)'}
            `;
        });
    });

    // Reset on mouse leave
    heroImage.addEventListener('mouseleave', function() {
        floatingCards.forEach(card => {
            card.style.transform = card.classList.contains('card1') ?
                'rotate(15deg)' :
                'rotate(-10deg)';
        });
    });
}

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element
 */
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Close modal on Escape key
    document.addEventListener('keydown', function escapeClose(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
            document.removeEventListener('keydown', escapeClose);
        }
    });
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

/**
 * Add window scroll event to update active section in the navigation
 */
document.addEventListener('scroll', function() {
    const sections = [
        { id: 'pricing', element: document.getElementById('pricing') },
        { id: 'case-studies', element: document.getElementById('case-studies') },
        { id: 'request-form', element: document.getElementById('request-form') }
    ];

    let currentSectionId = null;

    // Determine which section is in the viewport
    sections.forEach(section => {
        if (!section.element) return;

        const rect = section.element.getBoundingClientRect();
        const isInViewport = (
            rect.top <= 150 &&
            rect.bottom >= 150
        );

        if (isInViewport) {
            currentSectionId = section.id;
        }
    });

    // Update URL hash if a section is in view
    if (currentSectionId && window.location.hash !== `#${currentSectionId}`) {
        history.replaceState(null, null, `#${currentSectionId}`);
    }
});