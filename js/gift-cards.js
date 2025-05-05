/**
 * ShopVerse E-commerce Platform
 * Gift Cards Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gift cards page components
    initGiftCardBuilder();
    initThemeFilter();
    initAmountSelection();
    initDeliveryOptions();
    initFAQToggle();
    initMessageCounter();
    init3DEffects();
    initCurrentDate();
});

/**
 * Initialize Gift Card Builder
 */
function initGiftCardBuilder() {
    const steps = document.querySelectorAll('.gift-card-steps .step');
    const builderSteps = document.querySelectorAll('.builder-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    const previewButton = document.querySelector('.btn-preview');

    if (!steps.length || !builderSteps.length || !nextButtons.length) return;

    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            if (!nextStep) return;

            // Move to next step
            showStep(parseInt(nextStep));
        });
    });

    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-back');
            if (!prevStep) return;

            // Move to previous step
            showStep(parseInt(prevStep));
        });
    });

    // Preview button
    if (previewButton) {
        previewButton.addEventListener('click', function() {
            // Validate inputs
            if (!validateGiftCardForm()) return;

            // Update preview modal
            updateGiftCardPreview();

            // Open preview modal
            const modal = document.getElementById('giftCardPreview');
            if (modal) {
                openModal(modal);
            }
        });
    }

    // Modal close button
    const modalCloseBtn = document.querySelector('.modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            const modal = document.getElementById('giftCardPreview');
            if (modal) {
                closeModal(modal);
            }
        });
    }

    // Edit button in modal
    const editButton = document.querySelector('.btn-edit');
    if (editButton) {
        editButton.addEventListener('click', function() {
            const modal = document.getElementById('giftCardPreview');
            if (modal) {
                closeModal(modal);
            }
        });
    }

    // Add to cart button
    const addToCartButton = document.querySelector('.btn-add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            addGiftCardToCart();

            // Close modal after adding to cart
            const modal = document.getElementById('giftCardPreview');
            if (modal) {
                closeModal(modal);

                // Reset builder to step 1
                showStep(1);

                // Reset form
                resetGiftCardForm();
            }
        });
    }

    /**
     * Show specific step
     * @param {number} stepNumber - Step number to show (1-based)
     */
    function showStep(stepNumber) {
        // Update step indicators
        steps.forEach((step, index) => {
            const stepNum = parseInt(step.getAttribute('data-step'));

            if (stepNum < stepNumber) {
                // Mark previous steps as completed
                step.classList.remove('active');
                step.classList.add('completed');
            } else if (stepNum === stepNumber) {
                // Mark current step as active
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                // Mark later steps as inactive
                step.classList.remove('active', 'completed');
            }
        });

        // Show current builder step
        builderSteps.forEach((builderStep, index) => {
            builderStep.classList.toggle('active', index === stepNumber - 1);
        });

        // Scroll to top of builder section
        const builderSection = document.querySelector('.gift-card-builder__content');
        if (builderSection) {
            builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

/**
 * Initialize Theme Filter functionality
 */
function initThemeFilter() {
    const categoryButtons = document.querySelectorAll('.theme-category');
    const themes = document.querySelectorAll('.gift-card-theme');

    if (!categoryButtons.length || !themes.length) return;

    // Add click event to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active category
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter themes
            themes.forEach(theme => {
                const themeCategory = theme.getAttribute('data-category');
                if (category === 'all' || themeCategory === category) {
                    theme.style.display = '';
                } else {
                    theme.style.display = 'none';
                }
            });
        });
    });

    // Theme selection
    themes.forEach(theme => {
        theme.addEventListener('click', function() {
            // Update active theme
            themes.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Initialize Amount Selection functionality
 */
function initAmountSelection() {
    const amountOptions = document.querySelectorAll('input[name="gift-card-amount"]');
    const customAmountContainer = document.querySelector('.custom-amount-container');
    const customAmountInput = document.getElementById('custom-amount');

    if (!amountOptions.length || !customAmountContainer || !customAmountInput) return;

    amountOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Show/hide custom amount input
            if (this.value === 'custom') {
                customAmountContainer.style.display = 'block';
                customAmountInput.focus();
            } else {
                customAmountContainer.style.display = 'none';
            }
        });
    });

    // Validate custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            let value = parseInt(this.value);

            // Enforce min/max constraints
            if (value < 10) {
                this.value = 10;
            } else if (value > 500) {
                this.value = 500;
            }
        });
    }
}

/**
 * Initialize Delivery Options functionality
 */
function initDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('input[name="delivery-method"]');
    const emailFields = document.getElementById('email-delivery-fields');
    const mailFields = document.getElementById('mail-delivery-fields');

    if (!deliveryOptions.length || !emailFields || !mailFields) return;

    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Show/hide appropriate fields based on delivery method
            if (this.value === 'email') {
                emailFields.style.display = 'block';
                mailFields.style.display = 'none';
            } else if (this.value === 'mail') {
                emailFields.style.display = 'none';
                mailFields.style.display = 'block';
            } else {
                emailFields.style.display = 'none';
                mailFields.style.display = 'none';
            }
        });
    });

    // Set minimum date to today for date picker
    const deliveryDate = document.getElementById('delivery-date');
    if (deliveryDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;

        deliveryDate.setAttribute('min', formattedToday);

        // Default to today
        if (!deliveryDate.value) {
            deliveryDate.value = formattedToday;
        }
    }
}

/**
 * Initialize FAQ Toggle functionality
 */
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });
}

/**
 * Initialize Message Character Counter
 */
function initMessageCounter() {
    const messageText = document.getElementById('message-text');
    const charCount = document.getElementById('char-count');

    if (!messageText || !charCount) return;

    messageText.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;

        // Visual feedback when approaching limit
        if (count > 180) {
            charCount.style.color = '#e74c3c';
        } else {
            charCount.style.color = '';
        }
    });
}

/**
 * Initialize 3D Effects for Gift Card
 */
function init3DEffects() {
    const giftCardDesign = document.querySelector('.gift-card-design__front');

    if (!giftCardDesign) return;

    giftCardDesign.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = this.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        this.style.transform = `
            perspective(1000px)
            rotateY(${x * 10}deg)
            rotateX(${-y * 10}deg)
            translateZ(10px)
        `;
    });

    giftCardDesign.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
    });
}

/**
 * Initialize Current Date
 */
function initCurrentDate() {
    const deliveryDate = document.getElementById('delivery-date');

    if (!deliveryDate) return;

    // Set default value to current date if not already set
    if (!deliveryDate.value) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        deliveryDate.value = `${year}-${month}-${day}`;
    }
}

/**
 * Validate Gift Card Form
 * @returns {boolean} - True if form is valid
 */
function validateGiftCardForm() {
    let isValid = true;
    const errors = [];

    // Check if a theme is selected
    const selectedTheme = document.querySelector('.gift-card-theme.active');
    if (!selectedTheme) {
        errors.push('Please select a gift card design.');
        isValid = false;
    }

    // Check amount
    const selectedAmount = document.querySelector('input[name="gift-card-amount"]:checked');
    if (!selectedAmount) {
        errors.push('Please select a gift card amount.');
        isValid = false;
    } else if (selectedAmount.value === 'custom') {
        const customAmount = document.getElementById('custom-amount');
        if (!customAmount || isNaN(parseInt(customAmount.value)) || parseInt(customAmount.value) < 10 || parseInt(customAmount.value) > 500) {
            errors.push('Please enter a valid custom amount between $10 and $500.');
            isValid = false;
        }
    }

    // Check recipient information
    const recipientName = document.getElementById('recipient-name');
    if (!recipientName || !recipientName.value.trim()) {
        errors.push('Please enter the recipient\'s name.');
        isValid = false;
    }

    // Check delivery method specific fields
    const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
    if (!selectedDelivery) {
        errors.push('Please select a delivery method.');
        isValid = false;
    } else {
        if (selectedDelivery.value === 'email') {
            const recipientEmail = document.getElementById('recipient-email');
            if (!recipientEmail || !isValidEmail(recipientEmail.value)) {
                errors.push('Please enter a valid email address for the recipient.');
                isValid = false;
            }

            const deliveryDate = document.getElementById('delivery-date');
            if (!deliveryDate || !deliveryDate.value) {
                errors.push('Please select a delivery date.');
                isValid = false;
            }
        } else if (selectedDelivery.value === 'mail') {
            const recipientAddress = document.getElementById('recipient-address');
            if (!recipientAddress || !recipientAddress.value.trim()) {
                errors.push('Please enter the recipient\'s address.');
                isValid = false;
            }
        }
    }

    // Check sender name
    const senderName = document.getElementById('sender-name');
    if (!senderName || !senderName.value.trim()) {
        errors.push('Please enter your name as the sender.');
        isValid = false;
    }

    // Display errors if any
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
    }

    return isValid;
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
 * Update Gift Card Preview Modal
 */
function updateGiftCardPreview() {
    // Get selected design
    const selectedTheme = document.querySelector('.gift-card-theme.active');
    const designName = selectedTheme.getAttribute('data-theme');
    const designImage = selectedTheme.querySelector('img').src;

    // Get amount
    const selectedAmount = document.querySelector('input[name="gift-card-amount"]:checked');
    let amount = '$25.00';

    if (selectedAmount.value === 'custom') {
        const customAmount = document.getElementById('custom-amount');
        amount = `$${parseFloat(customAmount.value).toFixed(2)}`;
    } else {
        amount = `$${parseFloat(selectedAmount.value).toFixed(2)}`;
    }

    // Get delivery method
    const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
    let deliveryMethod = 'Email';
    let deliveryFee = 0;

    if (selectedDelivery.value === 'mail') {
        deliveryMethod = 'Mail';
        deliveryFee = 4.95;
    } else if (selectedDelivery.value === 'print') {
        deliveryMethod = 'Print at Home';
    }

    // Get recipient and sender info
    const recipientName = document.getElementById('recipient-name').value;
    const senderName = document.getElementById('sender-name').value;
    const message = document.getElementById('message-text').value || 'No message';

    // Update preview elements
    document.querySelector('.design-background').src = designImage;
    document.getElementById('preview-recipient').textContent = recipientName;
    document.getElementById('preview-sender').textContent = senderName;
    document.getElementById('preview-message').textContent = message;
    document.querySelector('.gift-card-amount').textContent = amount;

    // Update details
    document.getElementById('preview-design').textContent = designName.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    document.getElementById('preview-amount').textContent = amount;
    document.getElementById('preview-delivery').textContent = deliveryMethod;

    // Final price (amount + delivery fee)
    const finalPrice = parseFloat(amount.replace('$', '')) + deliveryFee;
    document.getElementById('final-price').textContent = `$${finalPrice.toFixed(2)}`;

    // Delivery specifics
    const dateContainer = document.getElementById('preview-date-container');
    const addressContainer = document.getElementById('preview-address-container');

    if (selectedDelivery.value === 'email') {
        const deliveryDate = document.getElementById('delivery-date');

        // Format date for display (YYYY-MM-DD to Month Day, Year)
        const formattedDate = formatDate(deliveryDate.value);
        document.getElementById('preview-date').textContent = formattedDate;

        dateContainer.style.display = 'flex';
        addressContainer.style.display = 'none';
    } else if (selectedDelivery.value === 'mail') {
        const recipientAddress = document.getElementById('recipient-address');
        document.getElementById('preview-address').textContent = recipientAddress.value;

        dateContainer.style.display = 'none';
        addressContainer.style.display = 'flex';
    } else {
        dateContainer.style.display = 'none';
        addressContainer.style.display = 'none';
    }
}

/**
 * Format date for display
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date (Month Day, Year)
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Add gift card to cart
 */
function addGiftCardToCart() {
    // Get gift card details
    const selectedTheme = document.querySelector('.gift-card-theme.active');
    const designName = selectedTheme.getAttribute('data-theme');

    // Get amount and delivery details
    const selectedDelivery = document.querySelector('input[name="delivery-method"]:checked');
    const selectedAmount = document.querySelector('input[name="gift-card-amount"]:checked');

    let amount = 25;
    if (selectedAmount.value === 'custom') {
        const customAmount = document.getElementById('custom-amount');
        amount = parseFloat(customAmount.value);
    } else {
        amount = parseFloat(selectedAmount.value);
    }

    let deliveryFee = 0;
    if (selectedDelivery.value === 'mail') {
        deliveryFee = 4.95;
    }

    // Create gift card product object
    const giftCardProduct = {
        id: `gc-${designName}-${Date.now()}`,
        name: `${designName.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())} Gift Card`,
        price: amount,
        deliveryFee: deliveryFee,
        quantity: 1,
        totalPrice: amount + deliveryFee,
        image: selectedTheme.querySelector('img').src,
        type: 'gift-card',
        recipient: document.getElementById('recipient-name').value,
        deliveryMethod: selectedDelivery.value
    };

    // Add to cart (using cart.js if available)
    if (typeof window.addToCartItem === 'function') {
        window.addToCartItem(giftCardProduct.id, 1, giftCardProduct);
    } else {
        // Fallback if cart.js is not available
        console.log('Adding gift card to cart:', giftCardProduct);

        // Show notification
        showNotification('Gift card added to your cart!', 'success');

        // Update cart count
        const cartCounts = document.querySelectorAll('.action__item.cart .count');
        cartCounts.forEach(count => {
            const currentCount = parseInt(count.textContent) || 0;
            count.textContent = currentCount + 1;
        });
    }
}

/**
 * Reset gift card form
 */
function resetGiftCardForm() {
    // Reset step 1
    document.querySelectorAll('.gift-card-theme').forEach(theme => {
        theme.classList.remove('active');
    });
    document.querySelector('.gift-card-theme[data-theme="classic"]').classList.add('active');

    document.querySelectorAll('.theme-category').forEach(category => {
        category.classList.remove('active');
    });
    document.querySelector('.theme-category[data-category="all"]').classList.add('active');

    // Reset step 2
    document.getElementById('amount-25').checked = true;
    document.querySelector('.custom-amount-container').style.display = 'none';
    document.getElementById('custom-amount').value = '75';

    // Reset step 3
    document.getElementById('delivery-email').checked = true;
    document.getElementById('recipient-name').value = '';
    document.getElementById('recipient-email').value = '';
    document.getElementById('recipient-address').value = '';
    document.getElementById('sender-name').value = '';
    document.getElementById('message-text').value = '';
    document.getElementById('char-count').textContent = '0';

    // Reset delivery options display
    document.getElementById('email-delivery-fields').style.display = 'block';
    document.getElementById('mail-delivery-fields').style.display = 'none';

    // Reset form visual cues
    document.getElementById('char-count').style.color = '';
}

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element
 */
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling

    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal(modal);
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
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type: success, error, or info
 */
function showNotification(message, type = 'info') {
    // Check if there's an existing showNotification function from main.js
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

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}