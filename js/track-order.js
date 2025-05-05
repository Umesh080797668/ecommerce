/**
 * ShopVerse E-commerce Platform
 * Track Order Page JavaScript
 * 
 * This file handles all functionality for the order tracking system
 * including form submission, displaying tracking results, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const trackOrderForm = document.getElementById('track-order-form');
    const trackResult = document.getElementById('track-result');
    const faqItems = document.querySelectorAll('.faq-item');
    const backToTopBtn = document.querySelector('.back-to-top');

    // Initialize the page
    initTrackOrderForm();
    initFaqAccordion();
    initScrollEvents();

    /**
     * Initialize the order tracking form functionality
     */
    function initTrackOrderForm() {
        if (!trackOrderForm) return;

        trackOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const orderId = document.getElementById('order-id').value.trim();
            const orderEmail = document.getElementById('order-email').value.trim();

            if (!orderId || !orderEmail) {
                showFormError('Please fill in all required fields');
                return;
            }

            // In a real application, you would make an AJAX request to your backend
            // to fetch the actual order tracking information
            fetchOrderDetails(orderId, orderEmail);
        });
    }

    /**
     * Show form error message
     * @param {string} message - Error message to display
     */
    function showFormError(message) {
        // Check if error element already exists
        let errorElement = document.querySelector('.form-error');

        if (!errorElement) {
            // Create error element if it doesn't exist
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            errorElement.style.color = '#dc3545';
            errorElement.style.marginTop = '10px';
            errorElement.style.fontSize = '14px';
            trackOrderForm.appendChild(errorElement);
        }

        // Set error message and show with animation
        errorElement.textContent = message;
        errorElement.style.opacity = '0';
        errorElement.style.display = 'block';

        // Fade in animation
        setTimeout(() => {
            errorElement.style.transition = 'opacity 0.3s ease';
            errorElement.style.opacity = '1';
        }, 10);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.style.opacity = '0';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 300);
        }, 5000);
    }

    /**
     * Fetch order details from server
     * @param {string} orderId - Order ID entered by user
     * @param {string} email - Email entered by user
     */
    function fetchOrderDetails(orderId, email) {
        // Show loading state
        showLoadingState();

        // In a real application, you would make an API call here
        // For demo purposes, we'll simulate a network request with setTimeout
        setTimeout(() => {
            // For demo, we'll always show success
            // In a real app, you would check the response and show errors if needed
            showOrderDetails();
        }, 1500);
    }

    /**
     * Show loading state while fetching order details
     */
    function showLoadingState() {
        // Create and show loading spinner
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-spinner';
        loadingEl.innerHTML = `
            <div class="spinner-container">
                <div class="spinner"></div>
                <p>Looking up your order...</p>
            </div>
        `;

        // Add styles
        loadingEl.style.position = 'absolute';
        loadingEl.style.top = '0';
        loadingEl.style.left = '0';
        loadingEl.style.width = '100%';
        loadingEl.style.height = '100%';
        loadingEl.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        loadingEl.style.display = 'flex';
        loadingEl.style.justifyContent = 'center';
        loadingEl.style.alignItems = 'center';
        loadingEl.style.zIndex = '10';

        // Dark mode support
        if (document.body.classList.contains('dark-mode')) {
            loadingEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        }

        // Add to the form container
        trackOrderForm.parentElement.style.position = 'relative';
        trackOrderForm.parentElement.appendChild(loadingEl);
    }

    /**
     * Show order details after successful fetch
     */
    function showOrderDetails() {
        // Remove loading spinner
        const loadingEl = document.querySelector('.loading-spinner');
        if (loadingEl) {
            loadingEl.remove();
        }

        // Hide the form and show results
        trackOrderForm.style.display = 'none';

        // Slide down animation for results
        trackResult.style.display = 'block';
        trackResult.style.opacity = '0';
        trackResult.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            trackResult.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            trackResult.style.opacity = '1';
            trackResult.style.transform = 'translateY(0)';

            // Scroll to results
            trackResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Initialize progress bar animation
            initProgressBarAnimation();
        }, 50);
    }

    /**
     * Initialize progress bar animation
     */
    function initProgressBarAnimation() {
        const progressSteps = document.querySelectorAll('.progress-step');
        let delay = 300;

        progressSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                step.style.transform = 'translateX(0)';
                step.style.opacity = '1';
            }, delay * index);
        });
    }

    /**
     * Initialize FAQ accordion functionality
     */
    function initFaqAccordion() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            // Set initial height for CSS transitions
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }

            question.addEventListener('click', () => {
                // Toggle active state on clicked item
                const isActive = item.classList.contains('active');

                // Close all items first
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }
                });

                // Toggle the clicked item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    /**
     * Initialize scroll-based events
     */
    function initScrollEvents() {
        // Back to top button visibility
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        // Back to top button click
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Print shipping label functionality
     */
    const printLabelBtn = document.querySelector('.tracking-actions a[class*="btn-outline"]');
    if (printLabelBtn) {
        printLabelBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // In a real app, you would generate and download a PDF
            alert('In a real application, this would generate and download a shipping label PDF.');
        });
    }

    /**
     * Contact support functionality
     */
    const contactSupportBtn = document.querySelector('.tracking-actions a[class*="btn-primary"]');
    if (contactSupportBtn) {
        contactSupportBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Show contact options modal
            showContactModal();
        });
    }

    /**
     * Show contact support modal
     */
    function showContactModal() {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Contact Customer Support</h3>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <p>Choose how you would like to contact our support team:</p>
                    <div class="contact-options">
                        <a href="tel:+1234567890" class="contact-option">
                            <i class="fas fa-phone"></i>
                            <span>Call Us</span>
                            <small>+1-234-567-890</small>
                        </a>
                        <a href="mailto:support@shopverse.com" class="contact-option">
                            <i class="fas fa-envelope"></i>
                            <span>Email</span>
                            <small>support@shopverse.com</small>
                        </a>
                        <a href="#" class="contact-option chat-option">
                            <i class="fas fa-comment-dots"></i>
                            <span>Live Chat</span>
                            <small>Available 24/7</small>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease';

        // Add to body
        document.body.appendChild(modal);

        // Fade in animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);

        // Modal content styles
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.backgroundColor = 'var(--bg-card, #fff)';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.maxHeight = '90vh';
        modalContent.style.overflow = 'auto';
        modalContent.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        modalContent.style.transform = 'translateY(20px)';
        modalContent.style.transition = 'transform 0.3s ease';

        setTimeout(() => {
            modalContent.style.transform = 'translateY(0)';
        }, 10);

        // Modal header styles
        const modalHeader = modal.querySelector('.modal-header');
        modalHeader.style.padding = '20px';
        modalHeader.style.borderBottom = '1px solid var(--border-color, #eee)';
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';

        // Close button styles
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.color = 'var(--text-secondary, #666)';

        // Modal body styles
        const modalBody = modal.querySelector('.modal-body');
        modalBody.style.padding = '20px';

        // Contact options styles
        const contactOptions = modal.querySelector('.contact-options');
        contactOptions.style.display = 'grid';
        contactOptions.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
        contactOptions.style.gap = '15px';
        contactOptions.style.marginTop = '20px';

        const options = modal.querySelectorAll('.contact-option');
        options.forEach(option => {
            option.style.display = 'flex';
            option.style.flexDirection = 'column';
            option.style.alignItems = 'center';
            option.style.textAlign = 'center';
            option.style.padding = '20px';
            option.style.borderRadius = '8px';
            option.style.backgroundColor = 'var(--bg-light, #f8f9fa)';
            option.style.color = 'var(--text-primary, #333)';
            option.style.textDecoration = 'none';
            option.style.transition = 'all 0.3s ease';

            option.addEventListener('mouseenter', () => {
                option.style.backgroundColor = 'var(--primary-color, #007bff)';
                option.style.color = 'white';
            });

            option.addEventListener('mouseleave', () => {
                option.style.backgroundColor = 'var(--bg-light, #f8f9fa)';
                option.style.color = 'var(--text-primary, #333)';
            });
        });

        const icons = modal.querySelectorAll('.contact-option i');
        icons.forEach(icon => {
            icon.style.fontSize = '24px';
            icon.style.marginBottom = '10px';
        });

        const spans = modal.querySelectorAll('.contact-option span');
        spans.forEach(span => {
            span.style.fontWeight = '600';
            span.style.marginBottom = '5px';
        });

        const smalls = modal.querySelectorAll('.contact-option small');
        smalls.forEach(small => {
            small.style.fontSize = '12px';
            small.style.opacity = '0.8';
        });

        // Chat option click handler
        const chatOption = modal.querySelector('.chat-option');
        if (chatOption) {
            chatOption.addEventListener('click', function(e) {
                e.preventDefault();
                modal.remove();

                // In a real application, this would open a chat widget
                setTimeout(() => {
                    alert('In a real application, this would open a live chat widget.');
                }, 300);
            });
        }

        // Close modal on click
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal function
        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(20px)';

            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // Add date-time display functionality
    updateOrderTimestamp();

    /**
     * Update the order timestamp to show how long ago
     */
    function updateOrderTimestamp() {
        const timestamps = document.querySelectorAll('.timeline-date .date');

        timestamps.forEach(timestamp => {
            const dateText = timestamp.textContent.trim();

            // Convert to relative time if it's a valid date
            if (dateText.includes('May')) {
                const today = new Date();
                const day = parseInt(dateText.replace('May ', ''));
                const orderDate = new Date(today.getFullYear(), 4, day); // May is month 4 (zero-based)

                const diff = today - orderDate;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                if (days === 0) {
                    timestamp.innerHTML = 'Today';
                } else if (days === 1) {
                    timestamp.innerHTML = 'Yesterday';
                } else if (days < 7) {
                    timestamp.innerHTML = `${days} days ago`;
                }
                // Otherwise keep the original date format
            }
        });
    }
});

/**
 * Update dark mode styles based on user preference
 * This function is called from the global darkmode.js file
 */
function updateDarkModeStyles() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Update any track order specific dark mode styles
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.style.backgroundColor = isDarkMode ?
            'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    }
}