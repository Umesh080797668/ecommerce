/**
 * ShopVerse E-commerce Platform
 * Return & Refund Policy Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize return policy page components
    initNavScrollSpy();
    initEligibilityTabs();
    initDamageClassificationTabs();
    initReturnEligibilityChecker();
    initReturnVideoDemo();
    initContactForm();
    initShareModal();
    initPrintAndDownload();
});

/**
 * Initialize navigation scroll spy
 */
function initNavScrollSpy() {
    const navLinks = document.querySelectorAll('.policy-nav-list a');
    const sections = document.querySelectorAll('.policy-section');

    if (!navLinks.length || !sections.length) return;

    // Click event for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to section with offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Scroll event for updating active link
    const scrollSpy = () => {
        const currentScrollPos = window.pageYOffset;

        // Find which section is currently in view
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (currentScrollPos >= sectionTop && currentScrollPos < sectionBottom) {
                const id = section.getAttribute('id');

                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current section's link
                const activeLink = document.querySelector(`.policy-nav-list a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    // On scroll, call scrollSpy
    window.addEventListener('scroll', scrollSpy);

    // Call scrollSpy on load to set initial active link
    scrollSpy();

    // Make sidebar nav sticky on scroll
    const policySidebar = document.querySelector('.policy-sidebar');
    const policyContent = document.querySelector('.policy-content');

    if (policySidebar && policyContent) {
        const stickyNav = () => {
            const scrollPosition = window.pageYOffset;
            const contentTop = policyContent.offsetTop;

            if (window.innerWidth > 991) { // Only apply sticky behavior on desktop
                if (scrollPosition >= contentTop) {
                    policySidebar.style.position = 'sticky';
                    policySidebar.style.top = '100px';
                } else {
                    policySidebar.style.position = 'static';
                }
            } else {
                policySidebar.style.position = 'static'; // Reset on mobile
            }
        };

        window.addEventListener('scroll', stickyNav);
        window.addEventListener('resize', stickyNav);

        // Call once on load
        stickyNav();
    }
}

/**
 * Initialize eligibility tabs
 */
function initEligibilityTabs() {
    initTabs('.eligibility-tabs .tab-button', '.eligibility-tabs .tab-pane');
}

/**
 * Initialize damage classification tabs
 */
function initDamageClassificationTabs() {
    initTabs('.classification-tabs .tab-button', '.classification-tabs .tab-pane');
}

/**
 * Generic function to initialize tabs
 * @param {string} tabButtonSelector - CSS selector for tab buttons
 * @param {string} tabPaneSelector - CSS selector for tab content panes
 */
function initTabs(tabButtonSelector, tabPaneSelector) {
    const tabButtons = document.querySelectorAll(tabButtonSelector);
    const tabPanes = document.querySelectorAll(tabPaneSelector);

    if (!tabButtons.length || !tabPanes.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get tab id
            const tabId = button.getAttribute('data-tab');

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Show active tab pane
            const activePane = document.getElementById(`${tabId}-returns`);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
}

/**
 * Initialize return eligibility checker
 */
function initReturnEligibilityChecker() {
    const estimatorForm = document.getElementById('return-estimator-form');
    const resultsContainer = document.querySelector('.eligibility-results');
    const resultContent = document.querySelector('.eligibility-result');

    if (!estimatorForm || !resultsContainer || !resultContent) return;

    estimatorForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const orderDate = new Date(document.getElementById('order-date').value);
        const category = document.getElementById('product-category').value;
        const condition = document.getElementById('product-condition').value;

        // Validate form
        if (!orderDate || isNaN(orderDate.getTime()) || !category || !condition) {
            showNotification('Please fill in all the fields', 'error');
            return;
        }

        // Calculate eligibility
        const eligibility = calculateEligibility(orderDate, category, condition);

        // Display results
        displayEligibilityResults(eligibility);
    });

    /**
     * Calculate return eligibility based on inputs
     * @param {Date} orderDate - Date of purchase
     * @param {string} category - Product category
     * @param {string} condition - Product condition
     * @returns {object} - Eligibility result object
     */
    function calculateEligibility(orderDate, category, condition) {
        const today = new Date();
        const daysSincePurchase = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

        // Default eligibility object
        const eligibility = {
            status: 'ineligible',
            message: 'This item is not eligible for return.',
            details: []
        };

        // Check if product is in a non-returnable category
        const nonReturnableCategories = ['food'];
        if (nonReturnableCategories.includes(category)) {
            eligibility.message = 'Food and perishable items are not eligible for return.';
            eligibility.details.push('Food items are non-returnable for health and safety reasons.');
            return eligibility;
        }

        // Check if product is in opened/used condition
        if (condition === 'used' && category !== 'electronics') {
            eligibility.message = 'Used or worn items are not eligible for return.';
            eligibility.details.push('We only accept unused items in their original condition.');
            return eligibility;
        }

        // Check if product is damaged
        if (condition === 'damaged') {
            eligibility.status = 'eligible';
            eligibility.message = 'Damaged items may be eligible for return.';
            eligibility.details.push('Please report the damage within 48 hours of delivery.');
            eligibility.details.push('You will need to provide photos of the damaged item.');
            return eligibility;
        }

        // Check return window by category
        let returnWindow = 30; // Default for most items

        switch (category) {
            case 'clothing':
                returnWindow = condition === 'unopened' ? 30 : 14;
                break;
            case 'electronics':
                returnWindow = condition === 'unopened' ? 30 : 15;
                break;
            case 'beauty':
                returnWindow = condition === 'unopened' ? 14 : 0;
                break;
            default:
                returnWindow = 30;
        }

        // Check if still within return window
        if (daysSincePurchase <= returnWindow) {
            eligibility.status = 'eligible';
            eligibility.message = `This item is eligible for return within ${returnWindow} days of delivery.`;

            if (condition === 'opened' && category === 'electronics') {
                eligibility.status = 'partial';
                eligibility.message = 'This item is eligible for return, but may be subject to a restocking fee.';
                eligibility.details.push('Opened electronics may incur a 15% restocking fee.');
            }

            eligibility.details.push(`You have ${returnWindow - daysSincePurchase} days remaining to return this item.`);
        } else {
            eligibility.message = `The ${returnWindow}-day return window has expired.`;
            eligibility.details.push(`Return period ended ${daysSincePurchase - returnWindow} days ago.`);

            // Check if eligible for exchange only
            if (daysSincePurchase <= 45 && condition === 'unopened') {
                eligibility.status = 'partial';
                eligibility.message = 'This item is no longer eligible for refund but may be eligible for exchange.';
                eligibility.details.push('Exchanges may be possible up to 45 days after delivery for unopened items.');
            }
        }

        return eligibility;
    }

    /**
     * Display eligibility results
     * @param {object} eligibility - Eligibility result object
     */
    function displayEligibilityResults(eligibility) {
        let iconClass = '';

        switch (eligibility.status) {
            case 'eligible':
                iconClass = 'fa-check-circle';
                resultContent.className = 'eligibility-result eligible';
                break;
            case 'partial':
                iconClass = 'fa-exclamation-circle';
                resultContent.className = 'eligibility-result partial';
                break;
            case 'ineligible':
                iconClass = 'fa-times-circle';
                resultContent.className = 'eligibility-result ineligible';
                break;
        }

        let detailsHTML = '';
        if (eligibility.details.length) {
            detailsHTML = `<div class="eligibility-details">
                <ul>${eligibility.details.map(detail => `<li>${detail}</li>`).join('')}</ul>
            </div>`;
        }
        
        resultContent.innerHTML = `
            <h4><i class="fas ${iconClass}"></i> ${eligibility.message}</h4>
            <p>${eligibility.status === 'eligible' ? 
                'To initiate your return, please visit your order history or contact customer service.' : 
                eligibility.status === 'partial' ? 
                'You may have limited return options. Please contact customer service for assistance.' :
                'If you believe this is incorrect or have special circumstances, please contact customer service.'}
            </p>
            ${detailsHTML}
        `;
        
        // Show results container
        resultsContainer.style.display = 'block';
    }
}

/**
 * Initialize the return video demo
 */
function initReturnVideoDemo() {
    const demoVideo = document.querySelector('.demo-video');
    
    if (!demoVideo) return;
    
    demoVideo.addEventListener('click', function() {
        // In a real implementation, this would open a video player or a modal with a video
        // For this demo, we'll just show a notification
        showNotification('Video demonstration would play in a modal window', 'info');
    });
}

/**
 * Initialize contact form
 */
function initContactForm() {
    const contactForm = document.getElementById('returns-contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const inquiryType = document.getElementById('inquiry-type').value;
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !inquiryType || !message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // In a real implementation, this would submit the form data to a server
        // For this demo, we'll just show a success notification and reset the form
        showNotification('Your inquiry has been submitted. Our team will contact you shortly!', 'success');
        contactForm.reset();
    });
    
    /**
     * Check if email is valid
     * @param {string} email - Email to validate
     * @returns {boolean} - True if email is valid
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}

/**
 * Initialize share modal
 */
function initShareModal() {
    const shareButton = document.querySelector('.btn-share');
    const shareModal = document.getElementById('shareModal');
    
    if (!shareButton || !shareModal) {
        // If share modal doesn't exist yet, we won't attempt to initialize it
        return;
    }
    
    shareButton.addEventListener('click', function() {
        // In a real implementation, this would open a share modal
        // For this demo, we'll just show a notification
        showNotification('Share modal would open here', 'info');
    });
}

/**
 * Initialize print and download functionality
 */
function initPrintAndDownload() {
    const printBtn = document.querySelector('.btn-print');
    const downloadBtn = document.querySelector('.btn-download');
    
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // This is a simulated PDF download - in a real implementation,
            // this would likely call a server endpoint to generate a PDF
            showNotification('PDF download would start here', 'info');
        });
    }
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
 * Update copyright year
 */
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright');
    
    copyrightElements.forEach(element => {
        element.textContent = element.textContent.replace(/\d{4}/, currentYear);
    });
});