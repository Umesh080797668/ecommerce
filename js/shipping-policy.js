/**
 * ShopVerse E-commerce Platform
 * Shipping Policy Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize shipping policy page components
    initNavScrollSpy();
    initAccordion();
    initFAQToggle();
    initShareModal();
    initPrintAndDownload();
    initShippingCalculator();
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
 * Initialize accordion functionality
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (!accordionItems.length) return;

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            // Close other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Open first accordion item by default
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }
}

/**
 * Initialize FAQ Toggle functionality
 */
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

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

    // Open first FAQ item by default
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
    }
}

/**
 * Initialize share modal
 */
function initShareModal() {
    const shareButton = document.querySelector('.btn-share');
    const shareModal = document.getElementById('shareModal');
    const modalClose = shareModal ? shareModal.querySelector('.modal-close') : null;
    const shareOptions = shareModal ? shareModal.querySelectorAll('.share-option') : null;
    const copyLinkBtn = shareModal ? shareModal.querySelector('.btn-copy') : null;

    if (!shareButton || !shareModal) return;

    // Show modal when share button clicked
    shareButton.addEventListener('click', () => {
        shareModal.classList.add('active');
    });

    // Hide modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            shareModal.classList.remove('active');
        });
    }

    // Hide modal when clicking outside
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            shareModal.classList.remove('active');
        }
    });

    // Handle share options
    if (shareOptions) {
        shareOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();

                const platform = option.getAttribute('data-platform');
                let shareUrl = '';
                const pageUrl = encodeURIComponent(window.location.href);
                const pageTitle = encodeURIComponent('ShopVerse Shipping Policy');

                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                        break;
                    case 'email':
                        shareUrl = `mailto:?subject=${pageTitle}&body=Check out this shipping policy: ${decodeURIComponent(pageUrl)}`;
                        break;
                }

                if (shareUrl) {
                    // Open share URL in new window
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    // Copy to clipboard functionality
    if (copyLinkBtn) {
        const linkInput = shareModal.querySelector('.share-link input');

        copyLinkBtn.addEventListener('click', () => {
            if (linkInput) {
                linkInput.select();
                document.execCommand('copy');

                // Change tooltip text temporarily
                const originalTooltip = copyLinkBtn.getAttribute('data-tooltip');
                copyLinkBtn.setAttribute('data-tooltip', 'Copied!');

                // Reset tooltip after 2 seconds
                setTimeout(() => {
                    copyLinkBtn.setAttribute('data-tooltip', originalTooltip);
                }, 2000);
            }
        });
    }
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

            // Show a toast notification
            showNotification('Downloading PDF...', 'info');

            // Simulate download delay
            setTimeout(() => {
                // Create a fake download link
                const link = document.createElement('a');
                link.href = '#';
                link.setAttribute('download', 'ShopVerse-Shipping-Policy.pdf');

                // Simulate PDF download
                showNotification('Shipping Policy PDF downloaded successfully!', 'success');

                // In a real implementation, you would use:
                // link.href = 'path/to/generated/pdf';
                // link.click();
            }, 1500);
        });
    }
}

/**
 * Initialize shipping calculator
 */
function initShippingCalculator() {
    const calculatorForm = document.getElementById('shipping-calculator-form');
    const resultsContainer = document.querySelector('.shipping-results');
    const resultsContent = document.querySelector('.shipping-options-results');

    if (!calculatorForm || !resultsContainer || !resultsContent) return;

    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const country = document.getElementById('destination-country').value;
        const zipcode = document.getElementById('destination-zip').value;
        const weight = parseFloat(document.getElementById('order-weight').value) || 1;
        const value = parseFloat(document.getElementById('order-value').value) || 100;

        // Validate form
        if (!country) {
            showNotification('Please select a destination country', 'error');
            return;
        }

        // Show loading state
        resultsContent.innerHTML = '<p class="loading-text">Calculating shipping options...</p>';
        resultsContainer.style.display = 'block';

        // Simulate API call delay
        setTimeout(() => {
            // Generate shipping options based on inputs
            const options = generateShippingOptions(country, zipcode, weight, value);

            // Display results
            displayShippingResults(options);
        }, 1000);
    });

    /**
     * Generate shipping options based on user input
     * @param {string} country - Destination country
     * @param {string} zipcode - Destination zip/postal code
     * @param {number} weight - Order weight in kg
     * @param {number} value - Order value in $
     * @returns {Array} - Array of shipping option objects
     */
    function generateShippingOptions(country, zipcode, weight, value) {
        // This is a simulated response - in a real implementation, 
        // this would come from an API call to a shipping service

        const options = [];

        // Standard shipping
        let standardPrice = 5.99;
        let standardDays = '5-7';

        // Expedited shipping
        let expeditedPrice = 12.99;
        let expeditedDays = '2-3';

        // Express shipping
        let expressPrice = 19.99;
        let expressDays = '1-2';

        // Adjust based on country
        switch (country) {
            case 'US':
                // Base prices for US
                break;
            case 'CA':
                standardPrice += 4;
                expeditedPrice += 6;
                expressPrice += 8;
                standardDays = '7-10';
                expeditedDays = '3-5';
                expressDays = '2-3';
                break;
            case 'UK':
            case 'DE':
            case 'FR':
                standardPrice += 12;
                expeditedPrice += 18;
                expressPrice += 25;
                standardDays = '7-14';
                expeditedDays = '5-7';
                expressDays = '3-4';
                break;
            case 'AU':
                standardPrice += 15;
                expeditedPrice += 22;
                expressPrice += 30;
                standardDays = '10-14';
                expeditedDays = '7-10';
                expressDays = '4-6';
                break;
            default:
                standardPrice += 18;
                expeditedPrice += 25;
                expressPrice += 35;
                standardDays = '14-21';
                expeditedDays = '10-14';
                expressDays = '7-10';
        }

        // Adjust based on weight
        if (weight > 1) {
            const weightFactor = weight;
            standardPrice += (weightFactor - 1) * 2;
            expeditedPrice += (weightFactor - 1) * 3.5;
            expressPrice += (weightFactor - 1) * 5;
        }

        // Adjust based on value (insurance)
        if (value > 100) {
            const valueAddition = Math.ceil((value - 100) / 100) * 1.5;
            standardPrice += valueAddition;
            expeditedPrice += valueAddition;
            expressPrice += valueAddition;
        }

        // Round prices to 2 decimal places
        standardPrice = Math.round(standardPrice * 100) / 100;
        expeditedPrice = Math.round(expeditedPrice * 100) / 100;
        expressPrice = Math.round(expressPrice * 100) / 100;

        // Add options to array
        options.push({
            name: 'Standard Shipping',
            price: standardPrice,
            days: standardDays
        });

        options.push({
            name: 'Expedited Shipping',
            price: expeditedPrice,
            days: expeditedDays
        });

        // Add express option only if within certain countries
        if (['US', 'CA', 'UK', 'DE', 'FR', 'AU'].includes(country)) {
            options.push({
                name: 'Express Shipping',
                price: expressPrice,
                days: expressDays
            });
        }

        // Add free shipping option if eligible
        if (value >= 75 && country === 'US') {
            options.unshift({
                name: 'Free Standard Shipping',
                price: 0,
                days: '5-7',
                note: 'Orders over $75 qualify for free shipping'
            });
        }

        return options;
    }

    /**
     * Display shipping results in the UI
     * @param {Array} options - Array of shipping option objects
     */
    function displayShippingResults(options) {
        if (!options || options.length === 0) {
            resultsContent.innerHTML = '<p>No shipping options available for this destination.</p>';
            return;
        }

        let resultsHTML = '';

        options.forEach((option, index) => {
                    resultsHTML += `
                <div class="shipping-option-result ${index === 0 ? 'selected' : ''}" data-option="${index}">
                    <div class="option-info">
                        <span class="shipping-option-name">${option.name}</span>
                        <span class="shipping-option-time">${option.days} business days</span>
                        ${option.note ? `<span class="shipping-option-note">${option.note}</span>` : ''}
                    </div>
                    <div class="shipping-option-price">$${option.price.toFixed(2)}</div>
                </div>
            `;
        });
        
        resultsContent.innerHTML = resultsHTML;
        
        // Add click handlers to results
        const resultOptions = resultsContent.querySelectorAll('.shipping-option-result');
        
        resultOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                resultOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                this.classList.add('selected');
            });
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