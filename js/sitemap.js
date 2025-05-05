/**
 * ShopVerse E-commerce Platform
 * Sitemap Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sitemap page components
    initViewSwitcher();
    initCategoryFilter();
    initExpandCollapse();
    initSearch();
    initBranchCollapsing();
});

/**
 * Initialize view switcher between visual, list, and XML views
 */
function initViewSwitcher() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const views = document.querySelectorAll('.sitemap-view');

    if (!viewButtons.length || !views.length) return;

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show selected view, hide others
            const viewType = this.getAttribute('data-view');
            views.forEach(view => {
                if (view.id === `${viewType}-view`) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Initialize category filtering
 */
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const branches = document.querySelectorAll('.branch');
    const listSections = document.querySelectorAll('.list-section');

    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show/hide branches based on filter
            const category = this.getAttribute('data-filter');

            // Filter visual sitemap branches
            if (branches.length) {
                if (category === 'all') {
                    branches.forEach(branch => branch.style.display = 'block');
                } else {
                    branches.forEach(branch => {
                        if (branch.getAttribute('data-category') === category) {
                            branch.style.display = 'block';
                        } else {
                            branch.style.display = 'none';
                        }
                    });
                }
            }

            // Filter list sitemap sections
            if (listSections.length) {
                if (category === 'all') {
                    listSections.forEach(section => section.style.display = 'block');
                } else {
                    listSections.forEach(section => {
                        if (section.getAttribute('data-category') === category) {
                            section.style.display = 'block';
                        } else {
                            section.style.display = 'none';
                        }
                    });
                }
            }
        });
    });
}

/**
 * Initialize expand/collapse all functionality
 */
function initExpandCollapse() {
    const expandAllBtn = document.querySelector('.expand-all-btn');
    const collapseAllBtn = document.querySelector('.collapse-all-btn');
    const branches = document.querySelectorAll('.branch');

    if (!expandAllBtn || !collapseAllBtn || !branches.length) return;

    // Expand all branches
    expandAllBtn.addEventListener('click', function() {
        branches.forEach(branch => {
            const branchItems = branch.querySelector('.branch-items');
            const collapseBtn = branch.querySelector('.collapse-btn i');

            if (branchItems) {
                branchItems.style.display = 'block';
            }

            if (collapseBtn) {
                collapseBtn.className = 'fas fa-minus';
            }
        });
    });

    // Collapse all branches
    collapseAllBtn.addEventListener('click', function() {
        branches.forEach(branch => {
            const branchItems = branch.querySelector('.branch-items');
            const collapseBtn = branch.querySelector('.collapse-btn i');

            if (branchItems) {
                branchItems.style.display = 'none';
            }

            if (collapseBtn) {
                collapseBtn.className = 'fas fa-plus';
            }
        });
    });
}

/**
 * Initialize branch collapsing functionality
 */
function initBranchCollapsing() {
    const collapseBtns = document.querySelectorAll('.collapse-btn');

    if (!collapseBtns.length) return;

    collapseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const branch = this.closest('.branch');
            const branchItems = branch.querySelector('.branch-items');
            const icon = this.querySelector('i');

            if (branchItems.style.display === 'none') {
                branchItems.style.display = 'block';
                icon.className = 'fas fa-minus';
            } else {
                branchItems.style.display = 'none';
                icon.className = 'fas fa-plus';
            }
        });
    });
}

/**
 * Initialize sitemap search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('sitemap-search');
    const searchBtn = document.getElementById('search-btn');
    const clearSearchBtn = document.querySelector('.clear-search-btn');
    const searchResultsView = document.getElementById('search-results-view');
    const searchTermSpan = document.querySelector('.search-term');
    const resultsCount = document.querySelector('.results-count .count');
    const resultsList = document.querySelector('.results-list');
    const views = document.querySelectorAll('.sitemap-view');
    const viewButtons = document.querySelectorAll('.view-btn');

    if (!searchInput || !searchBtn || !searchResultsView) return;

    // Function to perform search
    const performSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm.length < 2) {
            showNotification('Please enter at least 2 characters to search', 'info');
            return;
        }

        // Show search results view, hide others
        views.forEach(view => view.classList.remove('active'));
        searchResultsView.classList.add('active');

        // Update view buttons
        viewButtons.forEach(btn => btn.classList.remove('active'));

        // Update search term display
        searchTermSpan.textContent = searchTerm;

        // Collect all pages from visual sitemap
        const allLinks = document.querySelectorAll('.node-link');
        const results = [];

        allLinks.forEach(link => {
            const label = link.querySelector('.node-label').textContent.toLowerCase();
            const url = link.getAttribute('href');
            const path = url.replace('../', '/').replace('.html', '');

            // Get category
            let category = 'main';
            const branch = link.closest('.branch');
            if (branch) {
                category = branch.getAttribute('data-category');
            }

            // Check if search term appears in label or path
            if (label.includes(searchTerm) || path.toLowerCase().includes(searchTerm)) {
                results.push({
                    label: link.querySelector('.node-label').textContent,
                    url: url,
                    path: path,
                    category: category,
                    icon: link.querySelector('.node-icon i').getAttribute('class')
                });
            }
        });

        // Update results count
        resultsCount.textContent = results.length;

        // Display results
        if (results.length > 0) {
            let resultsHTML = '';

            results.forEach(result => {
                // Get category display name
                let categoryName = 'Main Page';
                let categoryIcon = 'fas fa-file';

                switch (result.category) {
                    case 'product':
                        categoryName = 'Product Page';
                        categoryIcon = 'fas fa-shopping-bag';
                        break;
                    case 'account':
                        categoryName = 'Account Page';
                        categoryIcon = 'fas fa-user';
                        break;
                    case 'help':
                        categoryName = 'Help Page';
                        categoryIcon = 'fas fa-question-circle';
                        break;
                    case 'legal':
                        categoryName = 'Legal Page';
                        categoryIcon = 'fas fa-gavel';
                        break;
                }

                resultsHTML += `
                    <div class="result-item" data-category="${result.category}">
                        <div class="result-category">
                            <i class="${categoryIcon}"></i> ${categoryName}
                        </div>
                        <h4 class="result-title">
                            <a href="${result.url}">
                                <i class="${result.icon}"></i> ${result.label}
                            </a>
                        </h4>
                        <div class="result-path">${result.path}</div>
                    </div>
                `;
            });

            resultsList.innerHTML = resultsHTML;
        } else {
            resultsList.innerHTML = `
                <div class="no-results">
                    <p>No matches found for "${searchTerm}". Please try another search term.</p>
                </div>
            `;
        }
    };

    // Search button click event
    searchBtn.addEventListener('click', performSearch);

    // Enter key press in search input
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Clear search results
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';

            // Show the previously active view
            searchResultsView.classList.remove('active');
            document.querySelector('.view-btn.active').click();
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
 * Update dynamic content with current data
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update current date/time
    const currentDateTime = '2025-05-05 15:22:52';
    const dateTimeElements = document.querySelectorAll('.current-datetime');

    dateTimeElements.forEach(element => {
        element.textContent = currentDateTime;
    });

    // Update current user
    const currentUser = 'Umesh080797668';
    const userElements = document.querySelectorAll('.current-user');

    userElements.forEach(element => {
        element.textContent = currentUser;
    });

    // Update copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright');

    copyrightElements.forEach(element => {
        element.textContent = element.textContent.replace(/\d{4}/, currentYear);
    });
});