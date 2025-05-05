/**
 * ShopVerse E-commerce Platform
 * Admin Dashboard Functionality
 * @version 1.0.0
 * @author ShopVerse Development Team
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin dashboard components
    initAdminSidebar();
    initAdminCharts();
    initAdminTables();
    initAdminFilters();
    initAdminNotifications();
    initAdminActions();
});

/**
 * Initialize Admin Sidebar
 */
function initAdminSidebar() {
    const adminToggle = document.querySelector('.admin-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    const menuItems = document.querySelectorAll('.sidebar-menu__link');

    // Toggle sidebar on mobile
    if (adminToggle && adminSidebar) {
        adminToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.admin-sidebar') &&
                !e.target.closest('.admin-toggle') &&
                adminSidebar.classList.contains('active')
            ) {
                adminSidebar.classList.remove('active');
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
 * Initialize Admin Dashboard Charts
 * In a real application, these would be real charts with data
 */
function initAdminCharts() {
    // Check if chart placeholders exist
    const chartPlaceholders = document.querySelectorAll('.chart-placeholder');
    if (!chartPlaceholders.length) return;

    // This is a placeholder for actual chart implementation
    // In a real application, a charting library like Chart.js would be used
    console.log('Admin charts initialized');

    // Create simple visual placeholder for charts
    chartPlaceholders.forEach(placeholder => {
        createChartPlaceholder(placeholder);
    });

    // Simulate data loading for stats counters
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

    // Handle tab switching for charts
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // In a real app, this would update the chart data
                const tabType = this.textContent.toLowerCase();
                console.log(`Switching chart to ${tabType} view`);
            });
        });
    }
}

/**
 * Create a visual placeholder for charts
 * @param {HTMLElement} container - Container element
 */
function createChartPlaceholder(container) {
    // Determine if this is likely a bar/line chart or pie/donut chart
    const isBarOrLine = container.textContent.includes('Sales');

    // Clear existing content
    container.textContent = '';

    if (isBarOrLine) {
        // Create a bar chart placeholder
        const barChartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        barChartSvg.setAttribute('width', '100%');
        barChartSvg.setAttribute('height', '100%');
        barChartSvg.style.padding = '20px';

        // Add axes
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', '40');
        xAxis.setAttribute('y1', '280');
        xAxis.setAttribute('x2', '580');
        xAxis.setAttribute('y2', '280');
        xAxis.setAttribute('stroke', '#ccc');
        xAxis.setAttribute('stroke-width', '1');

        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', '40');
        yAxis.setAttribute('y1', '40');
        yAxis.setAttribute('x2', '40');
        yAxis.setAttribute('y2', '280');
        yAxis.setAttribute('stroke', '#ccc');
        yAxis.setAttribute('stroke-width', '1');

        barChartSvg.appendChild(xAxis);
        barChartSvg.appendChild(yAxis);

        // Add bars
        const barColors = ['#4a6cf7', '#6d8dff', '#8da6ff', '#adbeff', '#ced5ff'];
        const barWidth = 40;
        const barGap = 20;
        let startX = 60;

        for (let i = 0; i < 7; i++) {
            const barHeight = Math.floor(Math.random() * 180) + 40; // Random height between 40-220px
            const barY = 280 - barHeight;

            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', startX.toString());
            bar.setAttribute('y', barY.toString());
            bar.setAttribute('width', barWidth.toString());
            bar.setAttribute('height', barHeight.toString());
            bar.setAttribute('fill', barColors[i % barColors.length]);
            bar.setAttribute('rx', '4');

            barChartSvg.appendChild(bar);
            startX += barWidth + barGap;
        }

        container.appendChild(barChartSvg);
    } else {
        // Create a donut chart placeholder
        const donutChartSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        donutChartSvg.setAttribute('width', '100%');
        donutChartSvg.setAttribute('height', '100%');
        donutChartSvg.setAttribute('viewBox', '0 0 100 100');

        const colors = ['#4a6cf7', '#38b2ac', '#ed64a6', '#f6ad55', '#a0aec0'];
        let startAngle = 0;

        // Create 5 segments
        for (let i = 0; i < 5; i++) {
            const angle = (Math.random() * 0.2 + 0.1) * Math.PI * 2; // Between 10-30% of a circle
            const endAngle = startAngle + angle;

            const x1 = 50 + 35 * Math.cos(startAngle);
            const y1 = 50 + 35 * Math.sin(startAngle);
            const x2 = 50 + 35 * Math.cos(endAngle);
            const y2 = 50 + 35 * Math.sin(endAngle);

            const largeArcFlag = angle > Math.PI ? 1 : 0;

            const pathData = [
                'M', 50, 50,
                'L', x1, y1,
                'A', 35, 35, 0, largeArcFlag, 1, x2, y2,
                'Z'
            ].join(' ');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', colors[i]);

            donutChartSvg.appendChild(path);
            startAngle = endAngle;
        }

        // Add inner circle for donut hole
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', '#fff');

        donutChartSvg.appendChild(circle);
        container.appendChild(donutChartSvg);
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
 * Initialize Admin Tables
 */
function initAdminTables() {
    const orderTables = document.querySelectorAll('.orders-table');
    if (!orderTables.length) return;

    // Add row hover effect
    orderTables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(74, 108, 247, 0.05)';
            });

            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });

        // Add view button functionality
        const viewButtons = table.querySelectorAll('.btn-outline');
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                // Get order ID from the row
                const row = this.closest('tr');
                const orderId = row.cells[0].textContent;

                // In a real app, this would open order details
                // For demo purposes, just show a notification
                showNotification(`Viewing order details for ${orderId}`, 'info');
            });
        });
    });
}

/**
 * Initialize Admin Filters
 */
function initAdminFilters() {
    // Date range picker (placeholder)
    const dateRangePicker = document.querySelector('.date-range-picker');

    if (dateRangePicker) {
        dateRangePicker.addEventListener('click', function(e) {
            e.preventDefault();

            // In a real app, this would open a date picker
            // For demo purposes, just show a notification
            showNotification('Date range picker would open here', 'info');
        });
    }

    // Filter dropdowns
    const filterDropdowns = document.querySelectorAll('.filter-dropdown');

    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // Get selected value
            const selectedValue = this.value;
            const filterType = this.getAttribute('data-filter-type');

            // In a real app, this would filter the data
            console.log(`Filtering ${filterType} by ${selectedValue}`);
        });
    });
}

/**
 * Initialize Admin Notifications
 */
function initAdminNotifications() {
    const notificationBadge = document.querySelector('.admin-notifications .badge');
    const notificationBtn = document.querySelector('.admin-notifications .btn');

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
 * Initialize Admin Actions
 */
function initAdminActions() {
    // Add Event Listener for Export Data buttons
    const exportButtons = document.querySelectorAll('.btn-export');

    exportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const dataType = this.getAttribute('data-export-type') || 'data';

            // In a real app, this would export real data
            // For demo purposes, just show a notification
            showNotification(`Exporting ${dataType}...`, 'info');

            // Simulate export process
            setTimeout(() => {
                showNotification(`${dataType} exported successfully!`, 'success');
            }, 1500);
        });
    });

    // Add Event Listener for Settings Form
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
 * Get data for reports
 * @param {string} reportType - Type of report
 * @param {Object} filters - Filters to apply
 * @returns {Promise<Array>} - Promise resolving to array of data
 */
function getReportData(reportType, filters = {}) {
    // In a real application, this would make an API call
    // For demo purposes, return mock data
    return new Promise(resolve => {
        setTimeout(() => {
            // Mock data
            const data = {
                sales: [
                    { date: '2025-01-01', orders: 42, revenue: 5684.25 },
                    { date: '2025-01-02', orders: 38, revenue: 4932.80 },
                    { date: '2025-01-03', orders: 56, revenue: 7451.15 },
                    { date: '2025-01-04', orders: 31, revenue: 3825.50 },
                    { date: '2025-01-05', orders: 47, revenue: 6123.75 }
                ],
                customers: [
                    { date: '2025-01', new: 156, returning: 423, total: 579 },
                    { date: '2025-02', new: 142, returning: 451, total: 593 },
                    { date: '2025-03', new: 187, returning: 476, total: 663 },
                    { date: '2025-04', new: 213, returning: 502, total: 715 }
                ],
                products: [
                    { name: 'Wireless Headphones', sales: 87, revenue: 21749.13, rating: 4.7 },
                    { name: 'Smart Watch', sales: 65, revenue: 20794.35, rating: 4.9 },
                    { name: 'Leather Handbag', sales: 43, revenue: 8169.57, rating: 4.5 },
                    { name: 'Smart Speaker', sales: 51, revenue: 7649.49, rating: 4.2 },
                    { name: 'Laptop Backpack', sales: 38, revenue: 3799.62, rating: 4.6 }
                ]
            };

            resolve(data[reportType] || []);
        }, 800);
    });
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

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string ('short', 'long', 'time', etc.)
 * @returns {string} - Formatted date string
 */
function formatDate(date, format = 'short') {
    const d = new Date(date);

    // Check if date is valid
    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }

    switch (format) {
        case 'short':
            return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        case 'long':
            return d.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        case 'time':
            return d.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        case 'datetime':
            return d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        default:
            return d.toLocaleDateString();
    }
}

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Calculate percentage change
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {string} - Formatted percentage string with + or - prefix
 */
function calculatePercentageChange(current, previous) {
    if (previous === 0) return '+∞%';

    const change = ((current - previous) / previous) * 100;
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toFixed(1)}%`;
}

/**
 * Add active user indicator to the dashboard
 * Shows when the admin was last active
 * @param {string} username - Username of admin
 * @param {string} lastActive - Last active timestamp (ISO format)
 */
function addActiveUserIndicator(username, lastActive) {
    const userInfo = document.querySelector('.admin-user__info');

    if (userInfo) {
        const lastActiveElem = document.createElement('div');
        lastActiveElem.className = 'admin-user__last-active';
        lastActiveElem.style.fontSize = '0.75rem';
        lastActiveElem.style.color = 'var(--text-light)';

        // Format the timestamp to a readable format
        const lastActiveDate = new Date(lastActive);
        const formattedDate = formatDate(lastActiveDate, 'datetime');

        lastActiveElem.textContent = `Last active: ${formattedDate}`;
        userInfo.appendChild(lastActiveElem);
    }
}

// Initialize the admin dashboard with the current user and timestamp
// In a real application, this would come from the server
document.addEventListener('DOMContentLoaded', function() {
    addActiveUserIndicator('Admin User', '2025-05-04T17:19:33Z');
});