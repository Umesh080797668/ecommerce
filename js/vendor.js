/**
 * ShopVerse E-commerce Platform
 * Vendor Dashboard Functionality
 * @version 1.0.0
 * @author ShopVerse Development Team
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize vendor dashboard components
    initVendorSidebar();
    initVendorCharts();
    initProductTable();
    initVendorNotifications();
    initVendorSettings();

    // Initialize page-specific components
    if (document.querySelector('.onboarding-steps')) {
        initOnboarding();
    }
});

/**
 * Initialize Vendor Sidebar
 */
function initVendorSidebar() {
    const vendorToggle = document.querySelector('.vendor-toggle');
    const vendorSidebar = document.querySelector('.vendor-sidebar');
    const menuItems = document.querySelectorAll('.sidebar-menu__link');

    // Toggle sidebar on mobile
    if (vendorToggle && vendorSidebar) {
        vendorToggle.addEventListener('click', function() {
            vendorSidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.vendor-sidebar') &&
                !e.target.closest('.vendor-toggle') &&
                vendorSidebar.classList.contains('active')
            ) {
                vendorSidebar.classList.remove('active');
            }
        });
    }

    // Handle active menu item
    if (menuItems.length) {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Skip for logout link
                if (this.getAttribute('href') === '../index.html') return;

                // Remove active class from all items
                menuItems.forEach(menuItem => menuItem.classList.remove('active'));

                // Add active class to clicked item
                this.classList.add('active');

                // In a real application, this would handle page navigation
                // For this demo, prevent default behavior
                if (this.getAttribute('href') === '#') {
                    event.preventDefault();
                }
            });
        });
    }
}

/**
 * Initialize Vendor Dashboard Charts
 * In a real application, these would be real charts with data
 */
function initVendorCharts() {
    // Check if charts exist on page
    if (!document.querySelector('.stat-card')) return;

    // This is a placeholder for actual chart implementation
    // In a real application, a charting library like Chart.js would be used
    console.log('Vendor charts initialized');

    // Simulate data loading delay for stats counters
    const statValues = document.querySelectorAll('.stat-card__value');

    if (statValues.length) {
        // Store original values
        const originalValues = [];
        statValues.forEach(value => {
            // Extract numeric value
            let rawValue = value.textContent;
            let isMonetary = rawValue.includes('$');
            let numericValue = parseFloat(rawValue.replace(/[^0-9.-]+/g, ''));

            originalValues.push({
                element: value,
                value: numericValue,
                isMonetary: isMonetary,
                format: rawValue.includes('.') ? 2 : 0
            });

            // Reset to zero
            value.textContent = isMonetary ? '$0' : '0';
        });

        // Animate counter from 0 to actual value
        setTimeout(() => {
            originalValues.forEach(item => {
                animateCounter(item.element, 0, item.value, 1500, item.isMonetary, item.format);
            });
        }, 500);
    }
}

/**
 * Animate a counter from start to end value
 */
function animateCounter(element, start, end, duration, isMonetary, decimalPlaces) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);

        // Format the value
        let formattedValue = currentValue;
        if (decimalPlaces > 0) {
            formattedValue = currentValue.toFixed(decimalPlaces);
        }

        if (isMonetary) {
            formattedValue = '$' + formattedValue;
        }

        element.textContent = formattedValue;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

/**
 * Initialize Product Table
 */
function initProductTable() {
    const productTable = document.querySelector('.products-table');
    if (!productTable) return;

    // Delete product functionality
    const deleteButtons = document.querySelectorAll('.action-buttons .fa-trash-alt');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const row = this.closest('tr');
            const productName = row.querySelector('span:not(.product-status)').textContent;

            if (confirm(`Are you sure you want to delete "${productName}"?`)) {
                // In a real app, this would make an API call to delete the product
                // For demo purposes, just remove the row with animation
                row.style.backgroundColor = '#fff8f8';
                setTimeout(() => {
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.remove();
                        showNotification(`"${productName}" has been deleted.`, 'success');
                    }, 300);
                }, 300);
            }
        });
    });

    // Edit product functionality
    const editButtons = document.querySelectorAll('.action-buttons .fa-edit');

    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const row = this.closest('tr');
            const productName = row.querySelector('span:not(.product-status)').textContent;

            // In a real app, this would open an edit form or navigate to an edit page
            // For demo purposes, just show a notification
            showNotification(`Editing "${productName}"`, 'info');
        });
    });
}

/**
 * Initialize Vendor Onboarding
 */
function initOnboarding() {
    const stepButtons = document.querySelectorAll('.step-action .btn');

    stepButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const stepItem = this.closest('.step-item');
            const stepNumber = stepItem.querySelector('.step-number');
            const stepAction = stepItem.querySelector('.step-action');

            // Mark step as completed
            stepItem.classList.add('completed');
            stepNumber.innerHTML = '<i class="fas fa-check"></i>';

            // Replace button with "Completed" badge
            stepAction.innerHTML = '<span class="badge">Completed</span>';

            // Show notification
            const stepTitle = stepItem.querySelector('.step-title').textContent;
            showNotification(`"${stepTitle}" step completed!`, 'success');
        });
    });
}

/**
 * Initialize Vendor Notifications
 */
function initVendorNotifications() {
    const notificationBadge = document.querySelector('.vendor-notifications .badge');
    const notificationBtn = document.querySelector('.vendor-notifications .btn');

    if (!notificationBadge || !notificationBtn) return;

    notificationBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // In a real app, this would open a notifications dropdown
        // For demo purposes, just reset the count
        notificationBadge.textContent = '0';

        showNotification('All notifications marked as read', 'info');
    });
}

/**
 * Initialize Vendor Settings
 */
function initVendorSettings() {
    // Placeholder for vendor settings functionality
    // In a real application, this would handle things like:
    // - Shop profile settings
    // - Payment settings
    // - Notification preferences
    // - Account security

    // Add event listener if we have settings form
    const settingsForm = document.querySelector('form.settings-form');

    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simulate saving settings
            const saveBtn = this.querySelector('button[type="submit"]');
            const originalText = saveBtn.textContent;

            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;

            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                showNotification('Settings saved successfully!', 'success');
            }, 1500);
        });
    }
}

/**
 * Show Notification
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');

    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);

        // Add style if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .notification {
                    min-width: 280px;
                    background-color: var(--white);
                    border-radius: var(--border-radius-md);
                    padding: 15px;
                    box-shadow: var(--box-shadow);
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    transform: translateX(100%);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .notification.success {
                    border-left: 3px solid #38b2ac;
                }
                
                .notification.error {
                    border-left: 3px solid #e53e3e;
                }
                
                .notification.info {
                    border-left: 3px solid #4a6cf7;
                }
                
                .notification-icon {
                    color: var(--primary-color);
                    font-size: 18px;
                }
                
                .notification.success .notification-icon {
                    color: #38b2ac;
                }
                
                .notification.error .notification-icon {
                    color: #e53e3e;
                }
                
                .notification.info .notification-icon {
                    color: #4a6cf7;
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-message {
                    margin: 0;
                    color: var(--dark-color);
                }
                
                .notification-close {
                    cursor: pointer;
                    color: var(--text-light);
                    transition: color 0.2s;
                }
                
                .notification-close:hover {
                    color: var(--dark-color);
                }
                
                .dark-mode .notification {
                    background-color: var(--dark-color);
                }
                
                .dark-mode .notification-message {
                    color: var(--white);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Set icon based on notification type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';

    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p class="notification-message">${message}</p>
        </div>
        <div class="notification-close">
            <i class="fas fa-times"></i>
        </div>
    `;

    // Append to container
    notificationContainer.appendChild(notification);

    // Add show class after a small delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Add event listener for close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

/**
 * Close Notification
 * @param {HTMLElement} notification - Notification element to close
 */
function closeNotification(notification) {
    notification.classList.remove('show');

    // Remove from DOM after animation completes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

/**
 * Export data to CSV
 * @param {Array} data - Data to export
 * @param {string} filename - Filename for download
 */
function exportToCSV(data, filename) {
    // Convert data to CSV format
    let csv = '';

    // Add headers
    if (data.length > 0) {
        csv += Object.keys(data[0]).join(',') + '\n';
    }

    // Add rows
    data.forEach(row => {
        csv += Object.values(row).map(value => {
            // Escape quotes and wrap in quotes if contains commas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}