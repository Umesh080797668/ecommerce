/**
 * ShopVerse E-commerce Platform
 * My Account Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize account page components
    initAccountNavigation();
    initAlertDismiss();
    initLogoutModal();
    initAvatarUpload();
});

/**
 * Initialize account navigation functionality
 */
function initAccountNavigation() {
    const menuItems = document.querySelectorAll('.account-menu-item a[data-section]');
    const sections = document.querySelectorAll('.account-section-content');

    if (!menuItems.length || !sections.length) return;

    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const targetSectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(`${targetSectionId}-section`);

            if (!targetSection) return;

            // Update active menu item
            menuItems.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');

            // Show target section, hide others
            sections.forEach(section => {
                section.classList.remove('active');
            });
            targetSection.classList.add('active');

            // Scroll to top of section on mobile
            if (window.innerWidth < 768) {
                window.scrollTo({
                    top: document.querySelector('.account-content').offsetTop - 20,
                    behavior: 'smooth'
                });
            }

            // Update URL hash for direct linking
            window.location.hash = targetSectionId;
        });
    });

    // Check URL hash on load to navigate to specific section
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.account-menu-item a[data-section="${hash}"]`);

        if (targetLink) {
            targetLink.click();
        }
    }
}

/**
 * Initialize alert dismiss functionality
 */
function initAlertDismiss() {
    const alertCloseButtons = document.querySelectorAll('.alert-close');

    alertCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alert = this.closest('.account-alert');

            if (alert) {
                alert.style.opacity = '0';
                setTimeout(() => {
                    alert.style.display = 'none';
                }, 300);
            }
        });
    });
}

/**
 * Initialize logout modal functionality
 */
function initLogoutModal() {
    const logoutLink = document.querySelector('.logout-link');
    const logoutModal = document.getElementById('logout-modal');

    if (!logoutLink || !logoutModal) return;

    const modalClose = logoutModal.querySelector('.modal-close');
    const modalCancel = logoutModal.querySelector('.modal-cancel');
    const modalConfirm = logoutModal.querySelector('.modal-confirm');

    // Show modal when logout link is clicked
    logoutLink.addEventListener('click', function(e) {
        e.preventDefault();
        logoutModal.classList.add('active');
    });

    // Hide modal when close button is clicked
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            logoutModal.classList.remove('active');
        });
    }

    // Hide modal when cancel button is clicked
    if (modalCancel) {
        modalCancel.addEventListener('click', () => {
            logoutModal.classList.remove('active');
        });
    }

    // Handle logout confirmation
    if (modalConfirm) {
        modalConfirm.addEventListener('click', () => {
            // In a real application, this would call a logout API endpoint
            window.location.href = 'login.html';
        });
    }

    // Hide modal when clicking outside
    logoutModal.addEventListener('click', (e) => {
        if (e.target === logoutModal) {
            logoutModal.classList.remove('active');
        }
    });
}

/**
 * Initialize avatar upload functionality
 */
function initAvatarUpload() {
    const avatarChange = document.querySelector('.avatar-change');

    if (!avatarChange) return;

    avatarChange.addEventListener('click', function() {
        // Create and trigger a file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';

        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    // Update avatar image
                    const avatarImg = document.querySelector('.user-avatar img');
                    if (avatarImg) {
                        avatarImg.src = e.target.result;
                    }

                    // In a real application, you would upload the image to a server
                    showNotification('Profile picture updated successfully!', 'success');
                };

                reader.readAsDataURL(this.files[0]);
            }
        });

        fileInput.click();
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
 * Update account information with current data
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update user info with the current user's login
    const username = 'Umesh080797668';
    const userInfoElement = document.querySelector('.user-info h3');
    if (userInfoElement) {
        userInfoElement.textContent = username;
    }

    // Update last login time with the current date and time
    const currentDateTime = '2025-05-05 14:52:40';
    const lastLoginElement = document.querySelector('.last-login');
    if (lastLoginElement) {
        lastLoginElement.textContent = `Last login: ${currentDateTime}`;
    }

    // Update copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright');

    copyrightElements.forEach(element => {
        element.textContent = element.textContent.replace(/\d{4}/, currentYear);
    });

    // Initialize other interactive elements
    initWishlistButtons();
    initPagination();
    initOrderFilters();
});

/**
 * Initialize wishlist buttons
 */
function initWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');

    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const icon = this.querySelector('i');

            // Toggle wishlist status
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Item added to wishlist', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Item removed from wishlist', 'info');
            }
        });
    });
}

/**
 * Initialize pagination
 */
function initPagination() {
    const paginationItems = document.querySelectorAll('.pagination-item');

    paginationItems.forEach(item => {
        if (!item.classList.contains('prev') && !item.classList.contains('next')) {
            item.addEventListener('click', function() {
                // Remove active class from all pagination items
                paginationItems.forEach(i => {
                    if (!i.classList.contains('prev') && !i.classList.contains('next')) {
                        i.classList.remove('active');
                    }
                });

                // Add active class to clicked item
                this.classList.add('active');

                // In a real application, this would fetch the corresponding page of data
                showNotification('Loading page ' + this.textContent, 'info');
            });
        }
    });

    // Handle previous/next buttons
    const prevButton = document.querySelector('.pagination-item.prev');
    const nextButton = document.querySelector('.pagination-item.next');

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            const activeItem = document.querySelector('.pagination-item.active');
            if (activeItem && activeItem.previousElementSibling &&
                !activeItem.previousElementSibling.classList.contains('prev')) {
                activeItem.previousElementSibling.click();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const activeItem = document.querySelector('.pagination-item.active');
            if (activeItem && activeItem.nextElementSibling &&
                !activeItem.nextElementSibling.classList.contains('next')) {
                activeItem.nextElementSibling.click();
            }
        });
    }
}

/**
 * Initialize order filters
 */
function initOrderFilters() {
    const filterDropdowns = document.querySelectorAll('.filter-dropdown select');
    const searchFilter = document.querySelector('.search-filter input');
    const searchButton = document.querySelector('.search-filter button');

    // Handle filter dropdowns change
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // In a real application, this would apply filters and fetch filtered data
            showNotification('Applying filters...', 'info');
        });
    });

    // Handle search button click
    if (searchButton && searchFilter) {
        searchButton.addEventListener('click', function() {
            const searchValue = searchFilter.value.trim();
            if (searchValue) {
                // In a real application, this would search orders
                showNotification('Searching for: ' + searchValue, 'info');
            }
        });

        // Also trigger search on Enter key
        searchFilter.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}