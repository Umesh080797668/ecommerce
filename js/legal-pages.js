/**
 * ShopVerse E-commerce Platform
 * Legal Pages JavaScript (Terms & Conditions, Privacy Policy, etc.)
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize legal pages components
    initNavScrollSpy();
    initTextSizeControls();
    initFAQToggle();
    initPrintAndDownload();
    initShareButton();
});

/**
 * Initialize navigation scroll spy for legal document sections
 */
function initNavScrollSpy() {
    const navLinks = document.querySelectorAll('.legal-nav-list a');
    const sections = document.querySelectorAll('.legal-section');

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
                const activeLink = document.querySelector(`.legal-nav-list a[href="#${id}"]`);
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
    const legalSidebar = document.querySelector('.legal-sidebar');
    const legalContent = document.querySelector('.legal-content');

    if (legalSidebar && legalContent) {
        const stickyNav = () => {
            const scrollPosition = window.pageYOffset;
            const contentTop = legalContent.offsetTop;

            if (window.innerWidth > 991) { // Only apply sticky behavior on desktop
                if (scrollPosition >= contentTop) {
                    legalSidebar.style.position = 'sticky';
                    legalSidebar.style.top = '100px';
                } else {
                    legalSidebar.style.position = 'static';
                }
            } else {
                legalSidebar.style.position = 'static'; // Reset on mobile
            }
        };

        window.addEventListener('scroll', stickyNav);
        window.addEventListener('resize', stickyNav);

        // Call once on load
        stickyNav();
    }
}

/**
 * Initialize text size controls
 */
function initTextSizeControls() {
    const textSizeButtons = document.querySelectorAll('.text-size-btn');
    const legalMain = document.querySelector('.legal-main');

    if (!textSizeButtons.length || !legalMain) return;

    // Store the current size in local storage if available
    const currentSize = localStorage.getItem('shopverse_legal_text_size') || 'medium';

    // Apply the stored size
    legalMain.classList.add('text-size-' + currentSize);

    // Set the active button
    textSizeButtons.forEach(button => {
        if (button.getAttribute('data-size') === currentSize) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    textSizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const size = this.getAttribute('data-size');

            // Remove all size classes
            legalMain.classList.remove('text-size-small', 'text-size-medium', 'text-size-large');

            // Add selected size class
            legalMain.classList.add('text-size-' + size);

            // Update active button state
            textSizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Store preference in local storage if available
            try {
                localStorage.setItem('shopverse_legal_text_size', size);
            } catch (e) {
                console.warn('Local storage not available for storing text size preference.');
            }
        });
    });
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
            // In a real implementation, this would generate a PDF of the current page
            // For this demo, we'll show a notification
            showNotification('Downloading PDF document...', 'info');

            // Simulate a download delay
            setTimeout(() => {
                showNotification('Document downloaded successfully!', 'success');
            }, 1500);
        });
    }
}

/**
 * Initialize share button functionality
 */
function initShareButton() {
    const shareBtn = document.querySelector('.btn-share');

    if (!shareBtn) return;

    shareBtn.addEventListener('click', () => {
        // Check if the Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support the Web Share API
            // We could show a custom share modal here, but for simplicity we'll just show a notification

            // Create a temporary input to copy the URL
            const tempInput = document.createElement('input');
            tempInput.value = window.location.href;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            showNotification('Link copied to clipboard!', 'success');
        }
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
 * Update copyright year
 */
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright');

    copyrightElements.forEach(element => {
        element.textContent = element.textContent.replace(/\d{4}/, currentYear);
    });
});