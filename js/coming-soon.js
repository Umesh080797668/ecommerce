/**
 * ShopVerse E-commerce Platform
 * Coming Soon Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize coming soon page components
    initMainCountdown();
    initFAQToggle();
    initNotificationForms();
    initFeatureAnimation();
    initSocialSharing();
});

/**
 * Initialize the Main Countdown Timer
 */
function initMainCountdown() {
    const countdownElements = document.querySelectorAll('.countdown-timer-large .countdown-value');
    if (!countdownElements.length) return;

    // Set end date to June 15, 2025
    const endDate = new Date('2025-06-15T00:00:00Z');

    // Current date
    const now = new Date('2025-05-05T09:38:41Z'); // Using the provided current date

    // Initial update
    updateCountdown(countdownElements, endDate, now);

    // Update countdown every second
    setInterval(() => {
        now.setSeconds(now.getSeconds() + 1);
        updateCountdown(countdownElements, endDate, now);
    }, 1000);
}

/**
 * Update Countdown Timer
 * @param {NodeList} elements - DOM elements for days, hours, minutes, seconds
 * @param {Date} endDate - Countdown end date
 * @param {Date} now - Current date
 */
function updateCountdown(elements, endDate, now) {
    const distance = endDate - now;

    // If countdown finished
    if (distance < 0) {
        elements[0].textContent = '00';
        elements[1].textContent = '00';
        elements[2].textContent = '00';
        elements[3].textContent = '00';
        return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update elements
    elements[0].textContent = days < 10 ? '0' + days : days;
    elements[1].textContent = hours < 10 ? '0' + hours : hours;
    elements[2].textContent = minutes < 10 ? '0' + minutes : minutes;
    elements[3].textContent = seconds < 10 ? '0' + seconds : seconds;
}

/**
 * Initialize FAQ Toggle Functionality
 */
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other FAQs
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
 * Initialize Notification Forms
 */
function initNotificationForms() {
    const notificationForm = document.getElementById('notification-signup');
    const highlightNotifyBtn = document.getElementById('highlight-notify-btn');
    const notificationModal = document.getElementById('notificationModal');
    const modalClose = notificationModal ? notificationModal.querySelector('.modal-close') : null;


    // Handle main notification form submission
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotificationModal();
        });
    }

    // Handle highlight section button click
    if (highlightNotifyBtn) {
        highlightNotifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotificationModal();
        });
    }

    // Close modal functionality
    if (modalClose) {
        modalClose.addEventListener('click', closeNotificationModal);

        // Close modal on background click
        notificationModal.addEventListener('click', function(e) {
            if (e.target === notificationModal) {
                closeNotificationModal();
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && notificationModal.classList.contains('active')) {
                closeNotificationModal();
            }
        });
    }

    /**
     * Show notification modal
     */
    function showNotificationModal() {
        if (notificationModal) {
            notificationModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }

    /**
     * Close notification modal
     */
    function closeNotificationModal() {
        if (notificationModal) {
            notificationModal.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    }
}

/**
 * Initialize Feature Animation
 * Animate feature cards when they come into view
 */
function initFeatureAnimation() {
    const featureCards = document.querySelectorAll('.feature-card');

    if (featureCards.length && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Set initial styles and observe each card
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        featureCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }
}

/**
 * Initialize Social Sharing Functionality
 */
function initSocialSharing() {
    const socialButtons = document.querySelectorAll('.social-button');

    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const shareUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent('Check out these amazing new features coming soon to ShopVerse!');
            let shareLink = '';

            if (this.classList.contains('facebook')) {
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
            } else if (this.classList.contains('twitter')) {
                shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
            } else if (this.classList.contains('linkedin')) {
                shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
            } else if (this.classList.contains('whatsapp')) {
                shareLink = `https://wa.me/?text=${shareText}%20${shareUrl}`;
            }

            if (shareLink) {
                window.open(shareLink, '_blank', 'width=600,height=400');
            }
        });
    });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if there's an existing showNotification function (from cart.js)
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

/**
 * Chat bubble animation
 * Make the chat bubble appear with a typing animation
 */
(function initChatBubbleAnimation() {
    const chatBubble = document.querySelector('.chat-bubble');
    if (!chatBubble) return;

    // Hide chat bubble initially
    chatBubble.style.opacity = '0';
    chatBubble.style.transform = 'translateY(20px)';

    // Show after 2 seconds
    setTimeout(() => {
        chatBubble.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        chatBubble.style.opacity = '1';
        chatBubble.style.transform = 'translateY(0)';

        // Animate typing effect
        const messageText = chatBubble.querySelector('.chat-message p');
        if (messageText) {
            const originalText = messageText.textContent;
            messageText.textContent = '';

            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < originalText.length) {
                    messageText.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);

                    // Show buttons after message is fully typed
                    const actionButtons = chatBubble.querySelectorAll('.chat-actions button');
                    actionButtons.forEach((button, index) => {
                        button.style.opacity = '0';
                        button.style.transform = 'translateY(10px)';

                        setTimeout(() => {
                            button.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            button.style.opacity = '1';
                            button.style.transform = 'translateY(0)';
                        }, 300 + (index * 200));
                    });
                }
            }, 30);
        }
    }, 2000);
})();