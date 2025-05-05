/**
 * ShopVerse E-commerce Platform
 * Help Center Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Help Center page components
    initHelpSearch();
    initCategoryCards();
    initSelfHelpTools();
    initContactForm();
    initLiveChat();
    initScrollToLinks();
});

/**
 * Initialize help center search functionality
 */
function initHelpSearch() {
    const searchInput = document.getElementById('help-search');
    const categorySelect = document.getElementById('search-category');
    const searchButton = document.getElementById('search-btn');

    if (!searchInput || !searchButton) return;

    searchButton.addEventListener('click', function() {
        const searchQuery = searchInput.value.trim();
        const category = categorySelect.value;

        if (searchQuery === '') {
            showNotification('Please enter a search query', 'info');
            return;
        }

        // Redirect to FAQ page with search parameters
        window.location.href = `faq.html?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(category)}`;
    });

    // Also search when pressing Enter
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}

/**
 * Initialize category cards functionality
 */
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();

            const category = this.getAttribute('data-category');

            // Redirect to FAQ page with selected category
            window.location.href = `faq.html#${category}`;
        });
    });
}

/**
 * Initialize self-help tools functionality
 */
function initSelfHelpTools() {
    // Order Tracker form
    const orderTrackerForm = document.getElementById('order-tracker-form');

    if (orderTrackerForm) {
        orderTrackerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const orderNumber = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();

            if (!orderNumber || !email) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // In a real application, this would send a request to an API to track the order
            showNotification('Looking up your order...', 'info');

            // Simulate a successful order tracking after a short delay
            setTimeout(() => {
                showNotification('Order found! Redirecting to order details...', 'success');

                // In a real application, this would redirect to an order details page
                // For this demo, we'll just reset the form
                orderTrackerForm.reset();
            }, 1500);
        });
    }

    // Password Reset form
    const passwordResetForm = document.getElementById('password-reset-form');

    if (passwordResetForm) {
        passwordResetForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value.trim();

            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }

            // In a real application, this would send a request to an API to initiate a password reset
            showNotification('Sending password reset instructions...', 'info');

            // Simulate a successful password reset initiation after a short delay
            setTimeout(() => {
                showNotification('Password reset email sent! Please check your inbox.', 'success');

                // Reset the form
                passwordResetForm.reset();
            }, 1500);
        });
    }

    // Invoice Generator form
    const invoiceForm = document.getElementById('invoice-form');

    if (invoiceForm) {
        invoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const orderNumber = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();

            if (!orderNumber || !email) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            // In a real application, this would send a request to an API to generate an invoice
            showNotification('Generating your invoice...', 'info');

            // Simulate a successful invoice generation after a short delay
            setTimeout(() => {
                showNotification('Invoice generated! Downloading PDF...', 'success');

                // Reset the form
                invoiceForm.reset();
            }, 1500);
        });
    }
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('help-contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const topic = document.getElementById('contact-topic').value;
        const message = document.getElementById('contact-message').value.trim();
        const terms = document.getElementById('contact-terms').checked;

        // Validate form
        if (!name || !email || !topic || !message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (!terms) {
            showNotification('Please accept the privacy policy', 'error');
            return;
        }

        // In a real application, this would send the form data to an API
        showNotification('Sending your message...', 'info');

        // Simulate form submission success after a short delay
        setTimeout(() => {
            showNotification('Your message has been sent! Our team will get back to you soon.', 'success');

            // Reset the form
            contactForm.reset();
        }, 1500);
    });

    // File input change handler
    const fileInput = document.getElementById('contact-attachment');
    const fileLabel = document.querySelector('.file-label span');

    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                // Display selected file name(s)
                if (this.files.length === 1) {
                    fileLabel.textContent = this.files[0].name;
                } else {
                    fileLabel.textContent = `${this.files.length} files selected`;
                }
            } else {
                fileLabel.textContent = 'Choose files';
            }
        });
    }
}

/**
 * Initialize live chat functionality
 */
function initLiveChat() {
    const chatButton = document.getElementById('chat-button');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const startChat = document.getElementById('start-chat');
    const sendMessage = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    if (!chatButton || !chatWidget) return;

    // Function to open chat
    const openChat = () => {
        chatWidget.style.display = 'flex';
        chatButton.style.display = 'none';
        // Focus on chat input
        if (chatInput) {
            setTimeout(() => {
                chatInput.focus();
            }, 100);
        }
    };

    // Function to close chat
    const closeTheChat = () => {
        chatWidget.style.display = 'none';
        chatButton.style.display = 'flex';
    };

    // Open chat from floating button
    chatButton.addEventListener('click', openChat);

    // Open chat from support section button
    if (startChat) {
        startChat.addEventListener('click', function(e) {
            e.preventDefault();
            openChat();
        });
    }

    // Close chat
    if (closeChat) {
        closeChat.addEventListener('click', closeTheChat);
    }

    // Send message functionality
    if (sendMessage && chatInput && chatMessages) {
        // Function to send chat message
        const sendChatMessage = () => {
            const message = chatInput.value.trim();

            if (message) {
                // Add user message to chat
                const currentTime = getCurrentTime();

                chatMessages.innerHTML += `
                    <div class="message user">
                        <div class="message-content">
                            <p>${message}</p>
                        </div>
                        <span class="message-time">${currentTime}</span>
                    </div>
                `;

                // Clear input
                chatInput.value = '';

                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Simulate agent response after a short delay
                setTimeout(() => {
                    // Sample automated response
                    const responses = [
                        "Thanks for reaching out! Our team will review your message and get back to you shortly.",
                        "I understand you have a question about that. Let me connect you with a specialist who can help you better.",
                        "Thank you for your message. A customer service representative will be with you shortly.",
                        "I've received your inquiry. While you wait, you might find useful information in our FAQ section."
                    ];

                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

                    chatMessages.innerHTML += `
                        <div class="message agent">
                            <div class="message-content">
                                <p>${randomResponse}</p>
                            </div>
                            <span class="message-time">${getCurrentTime()}</span>
                        </div>
                    `;

                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        };

        // Send message on button click
        sendMessage.addEventListener('click', sendChatMessage);

        // Send message on Enter key (without Shift)
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    // Helper function to get current time for chat messages
    function getCurrentTime() {
        // Get current time in YYYY-MM-DD HH:MM:SS format
        // For this demo, we'll use the fixed time: 2025-05-05 15:05:31
        return '2025-05-05 15:05:31';
    }
}

/**
 * Initialize scroll to links functionality
 */
function initScrollToLinks() {
    const scrollToLinks = document.querySelectorAll('.scroll-to');

    if (!scrollToLinks.length) return;

    scrollToLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll to the target element with smooth behavior
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // If the target is a form, focus on the first input after scrolling
                setTimeout(() => {
                    const firstInput = targetElement.querySelector('input:not([type="hidden"])');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            }
        });
    });
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

/**
 * Update dynamic content with current data
 */
document.addEventListener('DOMContentLoaded', function() {
    // Set username if logged in
    const currentUser = 'Umesh080797668';
    const userElements = document.querySelectorAll('.current-user');

    userElements.forEach(element => {
        element.textContent = currentUser;
    });

    // Update current date/time where needed
    const currentDateTime = '2025-05-05 15:05:31';
    const dateTimeElements = document.querySelectorAll('.current-datetime');

    dateTimeElements.forEach(element => {
        element.textContent = currentDateTime;
    });

    // Update copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright');

    copyrightElements.forEach(element => {
        element.textContent = element.textContent.replace(/\d{4}/, currentYear);
    });
});