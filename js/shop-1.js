/**
 * ShopVerse E-commerce Platform
 * Shop Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize shop page components
    initFilterToggle();
    initFilterCollapse();
    initPriceRangeSlider();
    initViewToggle();
    initProductFiltering();
    initQuickViews();
    initVendorPreviews();
    initRecentlyViewed();
    initPagination();
    loadMoreProducts();
});

/**
 * Initialize Filter Sidebar Toggle on Mobile
 */
function initFilterToggle() {
    const filterToggleBtn = document.getElementById('filter-toggle');
    const shopSidebar = document.querySelector('.shop-sidebar');

    if (!filterToggleBtn || !shopSidebar) return;

    filterToggleBtn.addEventListener('click', function() {
        shopSidebar.classList.toggle('active');
        this.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (
            shopSidebar.classList.contains('active') &&
            !shopSidebar.contains(e.target) &&
            e.target !== filterToggleBtn &&
            !filterToggleBtn.contains(e.target)
        ) {
            shopSidebar.classList.remove('active');
            filterToggleBtn.classList.remove('active');
        }
    });
}

/**
 * Initialize Filter Block Collapse functionality
 */
function initFilterCollapse() {
    const collapseButtons = document.querySelectorAll('.collapse-btn');

    collapseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterBlock = this.closest('.filter-block');
            const filterBody = filterBlock.querySelector('.filter-body');

            this.classList.toggle('collapsed');

            if (filterBody.style.display === 'none') {
                filterBody.style.display = 'block';
            } else {
                filterBody.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize Price Range Slider
 */
function initPriceRangeSlider() {
    const minInput = document.getElementById('min-price');
    const maxInput = document.getElementById('max-price');
    const minSlider = document.getElementById('price-min-range');
    const maxSlider = document.getElementById('price-max-range');
    const track = document.querySelector('.price-slider-track');

    if (!minInput || !maxInput || !minSlider || !maxSlider || !track) return;

    const maxRange = parseInt(minSlider.getAttribute('max'));

    // Update input when slider changes
    minSlider.addEventListener('input', function() {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);

        if (minValue > maxValue) {
            minSlider.value = maxValue;
            minInput.value = maxValue;
        } else {
            minInput.value = minValue;
        }

        updateTrack();
    });

    maxSlider.addEventListener('input', function() {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);

        if (maxValue < minValue) {
            maxSlider.value = minValue;
            maxInput.value = minValue;
        } else {
            maxInput.value = maxValue;
        }

        updateTrack();
    });

    // Update slider when input changes
    minInput.addEventListener('change', function() {
        let minValue = parseInt(minInput.value);
        const maxValue = parseInt(maxInput.value);

        // Validate input
        if (isNaN(minValue)) {
            minValue = 0;
            minInput.value = 0;
        }

        if (minValue < 0) {
            minValue = 0;
            minInput.value = 0;
        }

        if (minValue > maxRange) {
            minValue = maxRange;
            minInput.value = maxRange;
        }

        if (minValue > maxValue) {
            minValue = maxValue;
            minInput.value = maxValue;
        }

        minSlider.value = minValue;
        updateTrack();
    });

    maxInput.addEventListener('change', function() {
        let maxValue = parseInt(maxInput.value);
        const minValue = parseInt(minInput.value);

        // Validate input
        if (isNaN(maxValue)) {
            maxValue = maxRange;
            maxInput.value = maxRange;
        }

        if (maxValue > maxRange) {
            maxValue = maxRange;
            maxInput.value = maxRange;
        }

        if (maxValue < minValue) {
            maxValue = minValue;
            maxInput.value = minValue;
        }

        maxSlider.value = maxValue;
        updateTrack();
    });

    // Update the track position to visualize the selected range
    function updateTrack() {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);

        const minPercent = (minValue / maxRange) * 100;
        const maxPercent = (maxValue / maxRange) * 100;

        track.style.left = minPercent + '%';
        track.style.width = (maxPercent - minPercent) + '%';
    }

    // Initialize track
    updateTrack();

    // Apply button functionality
    const applyPriceBtn = document.querySelector('.btn-apply-price');
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', function() {
            applyPriceFilter(minInput.value, maxInput.value);
        });
    }

    function applyPriceFilter(min, max) {
        // Here you would typically update the product list based on the price range
        console.log(`Filtering products between $${min} and $${max}`);

        // Update active filters display
        const activeFilters = document.querySelector('.active-filter-tags');
        if (activeFilters) {
            // Check if price filter already exists
            const existingPriceFilter = Array.from(activeFilters.children).find(tag =>
                tag.textContent.includes('$')
            );

            if (existingPriceFilter) {
                existingPriceFilter.textContent = `$${min} - $${max}`;
                existingPriceFilter.appendChild(createRemoveButton());
            } else {
                const filterTag = document.createElement('span');
                filterTag.className = 'filter-tag';
                filterTag.textContent = `$${min} - $${max}`;
                filterTag.appendChild(createRemoveButton());
                activeFilters.appendChild(filterTag);
            }
        }

        // Apply other logic for filtering products
        filterProducts();
    }

    function createRemoveButton() {
        const button = document.createElement('button');
        button.className = 'remove-filter';
        button.innerHTML = '<i class="fas fa-times"></i>';

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const tag = this.parentNode;
            tag.remove();

            // Reset price filter
            minInput.value = 0;
            maxInput.value = maxRange;
            minSlider.value = 0;
            maxSlider.value = maxRange;
            updateTrack();

            // Reapply filter
            filterProducts();
        });

        return button;
    }
}

/**
 * Initialize Grid/List View Toggle
 */
function initViewToggle() {
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const productsContainer = document.getElementById('products-container');

    if (!gridViewBtn || !listViewBtn || !productsContainer) return;

    gridViewBtn.addEventListener('click', function() {
        setActiveView('grid');
    });

    listViewBtn.addEventListener('click', function() {
        setActiveView('list');
    });

    function setActiveView(viewType) {
        // Update buttons
        gridViewBtn.classList.toggle('active', viewType === 'grid');
        listViewBtn.classList.toggle('active', viewType === 'list');

        // Update container class
        productsContainer.classList.toggle('list-view', viewType === 'list');

        // Save preference to localStorage
        localStorage.setItem('shop-view-preference', viewType);
    }

    // Check for saved preference
    const savedViewPreference = localStorage.getItem('shop-view-preference');
    if (savedViewPreference === 'list') {
        setActiveView('list');
    }
}

/**
 * Initialize Product Filtering
 */
function initProductFiltering() {
    // Event listeners for filter checkboxes
    const categoryCheckboxes = document.querySelectorAll('.category-filter input[type="checkbox"]');
    const vendorCheckboxes = document.querySelectorAll('.vendor-filter input[type="checkbox"]');
    const ratingRadios = document.querySelectorAll('.rating-filter input[type="radio"]');
    const shippingCheckboxes = document.querySelectorAll('.shipping-filter input[type="checkbox"]');
    const sortSelect = document.getElementById('sort-select');

    // Add event listeners
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked && this.value === 'all') {
                // If "All Categories" is checked, uncheck others
                categoryCheckboxes.forEach(cb => {
                    if (cb !== this && cb.value !== 'all') {
                        cb.checked = false;
                    }
                });
            } else if (this.checked) {
                // If any other category is checked, uncheck "All Categories"
                const allCategoriesCheckbox = document.querySelector('.category-filter input[value="all"]');
                if (allCategoriesCheckbox) {
                    allCategoriesCheckbox.checked = false;
                }

                updateActiveFilters('category', this.nextElementSibling.nextElementSibling.textContent);
            }
        });
    });

    vendorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked && this.value === 'all') {
                // If "All Vendors" is checked, uncheck others
                vendorCheckboxes.forEach(cb => {
                    if (cb !== this && cb.value !== 'all') {
                        cb.checked = false;
                    }
                });
            } else if (this.checked) {
                // If any other vendor is checked, uncheck "All Vendors"
                const allVendorsCheckbox = document.querySelector('.vendor-filter input[value="all"]');
                if (allVendorsCheckbox) {
                    allVendorsCheckbox.checked = false;
                }

                updateActiveFilters('vendor', this.nextElementSibling.nextElementSibling.textContent);
            }
        });
    });

    shippingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                updateActiveFilters('shipping', this.nextElementSibling.nextElementSibling.textContent);
            } else {
                removeActiveFilter(this.nextElementSibling.nextElementSibling.textContent);
            }
        });
    });

    ratingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked && this.value !== 'all') {
                updateActiveFilters('rating', this.value + ' Stars');
            } else if (this.checked) {
                removeActiveFilter('Stars');
            }
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Apply sorting logic here
            const selectedSort = this.value;
            sortProducts(selectedSort);
        });
    }

    // Apply Filters button
    const applyFilterBtn = document.querySelector('.btn-apply');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            filterProducts();

            // On mobile, close the filter sidebar after applying
            const shopSidebar = document.querySelector('.shop-sidebar');
            if (window.innerWidth < 992 && shopSidebar) {
                shopSidebar.classList.remove('active');

                const filterToggleBtn = document.getElementById('filter-toggle');
                if (filterToggleBtn) {
                    filterToggleBtn.classList.remove('active');
                }
            }
        });
    }

    // Reset Filters button
    const resetFilterBtn = document.querySelector('.btn-reset');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            resetFilters();
        });
    }

    // Clear All Filters button
    const clearAllBtn = document.querySelector('.clear-all-filters');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            resetFilters();
        });
    }

    // Remove individual filter tags
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-filter') || e.target.closest('.remove-filter')) {
            const filterTag = e.target.closest('.filter-tag');
            if (filterTag) {
                removeActiveFilter(filterTag.textContent.trim());
                filterTag.remove();

                // Reapply filters
                filterProducts();
            }
        }
    });

    /**
     * Update active filters display
     * @param {string} type - Filter type (category, vendor, etc.)
     * @param {string} value - Filter value
     */
    function updateActiveFilters(type, value) {
        const activeFilters = document.querySelector('.active-filter-tags');
        if (!activeFilters) return;

        // Check if this filter already exists
        const existingFilter = Array.from(activeFilters.children).find(tag =>
            tag.textContent.includes(value)
        );

        if (!existingFilter) {
            const filterTag = document.createElement('span');
            filterTag.className = 'filter-tag';
            filterTag.textContent = value;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-filter';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';

            filterTag.appendChild(removeBtn);
            activeFilters.appendChild(filterTag);

            // Show active filters container
            const activeFiltersContainer = document.querySelector('.active-filters');
            if (activeFiltersContainer) {
                activeFiltersContainer.style.display = 'block';
            }
        }
    }

    /**
     * Remove active filter
     * @param {string} value - Filter value to remove
     */
    function removeActiveFilter(value) {
        const activeFilters = document.querySelector('.active-filter-tags');
        if (!activeFilters) return;

        Array.from(activeFilters.children).forEach(tag => {
            if (tag.textContent.includes(value)) {
                tag.remove();
            }
        });

        // If no more active filters, hide the container
        if (activeFilters.children.length === 0) {
            const activeFiltersContainer = document.querySelector('.active-filters');
            if (activeFiltersContainer) {
                activeFiltersContainer.style.display = 'none';
            }
        }

        // Also uncheck related filter inputs
        // Category filters
        categoryCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.nextElementSibling.textContent;
            if (label && value.includes(label)) {
                checkbox.checked = false;
            }
        });

        // Vendor filters
        vendorCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.nextElementSibling.textContent;
            if (label && value.includes(label)) {
                checkbox.checked = false;
            }
        });

        // Shipping filters
        shippingCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling.nextElementSibling.textContent;
            if (label && value.includes(label)) {
                checkbox.checked = false;
            }
        });

        // Rating filters
        if (value.includes('Stars')) {
            const allRatingsRadio = document.querySelector('.rating-filter input[value="all"]');
            if (allRatingsRadio) {
                allRatingsRadio.checked = true;
            }
        }

        // Price filter
        if (value.includes('$')) {
            const minInput = document.getElementById('min-price');
            const maxInput = document.getElementById('max-price');
            const minSlider = document.getElementById('price-min-range');
            const maxSlider = document.getElementById('price-max-range');
            const track = document.querySelector('.price-slider-track');

            if (minInput && maxInput && minSlider && maxSlider && track) {
                minInput.value = 0;
                maxInput.value = maxSlider.getAttribute('max');
                minSlider.value = 0;
                maxSlider.value = maxSlider.getAttribute('max');

                // Update track
                const maxRange = parseInt(maxSlider.getAttribute('max'));
                const minPercent = 0;
                const maxPercent = 100;

                track.style.left = minPercent + '%';
                track.style.width = (maxPercent - minPercent) + '%';
            }
        }
    }

    /**
     * Reset all filters
     */
    function resetFilters() {
        // Reset checkbox filters
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = checkbox.value === 'all';
        });

        vendorCheckboxes.forEach(checkbox => {
            checkbox.checked = checkbox.value === 'all';
        });

        shippingCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset radio filters
        const allRatingsRadio = document.querySelector('.rating-filter input[value="all"]');
        if (allRatingsRadio) {
            allRatingsRadio.checked = true;
        }

        // Reset price range
        const minInput = document.getElementById('min-price');
        const maxInput = document.getElementById('max-price');
        const minSlider = document.getElementById('price-min-range');
        const maxSlider = document.getElementById('price-max-range');
        const track = document.querySelector('.price-slider-track');

        if (minInput && maxInput && minSlider && maxSlider && track) {
            minInput.value = 0;
            maxInput.value = maxSlider.getAttribute('max');
            minSlider.value = 0;
            maxSlider.value = maxSlider.getAttribute('max');

            // Update track
            const maxRange = parseInt(maxSlider.getAttribute('max'));
            const minPercent = 0;
            const maxPercent = 100;

            track.style.left = minPercent + '%';
            track.style.width = (maxPercent - minPercent) + '%';
        }

        // Reset sort
        if (sortSelect) {
            sortSelect.value = 'popularity';
        }

        // Clear active filters display
        const activeFilters = document.querySelector('.active-filter-tags');
        if (activeFilters) {
            activeFilters.innerHTML = '';

            // Hide container
            const activeFiltersContainer = document.querySelector('.active-filters');
            if (activeFiltersContainer) {
                activeFiltersContainer.style.display = 'none';
            }
        }

        // Show all products
        filterProducts();
    }

    /**
     * Filter products based on selected filters
     */
    function filterProducts() {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;

        const products = productsContainer.querySelectorAll('.product-card');

        // Get selected filters
        const selectedCategories = [];
        const selectedVendors = [];
        const selectedShipping = [];
        let selectedRating = 0;
        let minPrice = 0;
        let maxPrice = 5000;

        categoryCheckboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedCategories.push(checkbox.value);
            }
        });

        vendorCheckboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                selectedVendors.push(checkbox.value);
            }
        });

        shippingCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedShipping.push(checkbox.value);
            }
        });

        ratingRadios.forEach(radio => {
            if (radio.checked && radio.value !== 'all') {
                selectedRating = parseInt(radio.value);
            }
        });

        // Get price range
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');

        if (minPriceInput && maxPriceInput) {
            minPrice = parseInt(minPriceInput.value) || 0;
            maxPrice = parseInt(maxPriceInput.value) || 5000;
        }

        // Filter products
        let visibleCount = 0;

        products.forEach(product => {
            const category = product.dataset.category;
            const vendor = product.dataset.vendor;
            const price = parseFloat(product.dataset.price);
            const rating = parseFloat(product.dataset.rating);

            const freeShipping = product.querySelector('.meta-item.free-shipping') !== null;
            const sameDayDelivery = product.querySelector('.meta-item.same-day') !== null;
            const nextDayDelivery = product.querySelector('.meta-item.next-day') !== null;

            // Check if product matches all selected filters
            let showProduct = true;

            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(category)) {
                showProduct = false;
            }

            // Vendor filter
            if (selectedVendors.length > 0 && !selectedVendors.includes(vendor)) {
                showProduct = false;
            }

            // Price filter
            if (price < minPrice || price > maxPrice) {
                showProduct = false;
            }

            // Rating filter
            if (selectedRating > 0 && rating < selectedRating) {
                showProduct = false;
            }

            // Shipping filter
            if (selectedShipping.length > 0) {
                const matchesShipping = (
                    (selectedShipping.includes('free-shipping') && freeShipping) ||
                    (selectedShipping.includes('same-day') && sameDayDelivery) ||
                    (selectedShipping.includes('next-day') && nextDayDelivery)
                );

                if (!matchesShipping) {
                    showProduct = false;
                }
            }

            // Show/hide product
            if (showProduct) {
                product.style.display = '';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        // Update count
        const productCount = document.getElementById('product-count');
        if (productCount) {
            productCount.textContent = visibleCount;
        }

        // Show "no results" message if no products match
        const noResultsMsg = document.getElementById('no-results-message');
        if (visibleCount === 0) {
            if (!noResultsMsg) {
                const message = document.createElement('div');
                message.id = 'no-results-message';
                message.className = 'no-results-message';
                message.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No matching products found</h3>
                        <p>Try adjusting your filters or browse our other categories.</p>
                        <button class="btn btn-primary reset-filters">Reset Filters</button>
                    </div>
                `;

                productsContainer.appendChild(message);

                // Add event listener to reset button
                message.querySelector('.reset-filters').addEventListener('click', resetFilters);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    /**
     * Sort products
     * @param {string} sortBy - Sort criterion
     */
    function sortProducts(sortBy) {
        const productsContainer = document.getElementById('products-container');
        if (!productsContainer) return;

        const products = Array.from(productsContainer.querySelectorAll('.product-card'));

        // Sort products
        products.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'rating':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                case 'newest':
                    return new Date(b.dataset.date || 0) - new Date(a.dataset.date || 0);
                case 'popularity':
                default:
                    // Default sort by vendor premium status first, then by rating
                    const aIsPremium = a.querySelector('.vendor-badge.premium') !== null;
                    const bIsPremium = b.querySelector('.vendor-badge.premium') !== null;

                    if (aIsPremium && !bIsPremium) return -1;
                    if (!aIsPremium && bIsPremium) return 1;

                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
            }
        });

        // Re-append products in sorted order
        products.forEach(product => {
            productsContainer.appendChild(product);
        });
    }
}

/**
 * Initialize Quick Views
 */
function initQuickViews() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn, .quick-view');
    const modal = document.getElementById('quickViewModal');

    if (!quickViewButtons.length || !modal) return;

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');

            // Fetch product details (in a real app, this would be an API call)
            const productDetails = getProductDetails(productId);
            if (productDetails) {
                updateQuickViewModal(productDetails);
                openModal(modal);
            }
        });
    });

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });

    /**
     * Get product details
     * @param {string} productId - Product ID
     * @returns {Object|null} - Product details or null if not found
     */
    function getProductDetails(productId) {
        // In a real app, this would be an API call
        // Mock data for demonstration purposes
        const products = {
            '1': {
                id: '1',
                name: 'Wireless Noise Cancelling Headphones',
                category: 'Electronics',
                vendor: {
                    name: 'Tech Gadgets Inc.',
                    isPremium: true,
                    rating: 4.8,
                    reviewCount: 120,
                    logo: '../assets/images/1.jpg'
                },
                price: '$249.99',
                oldPrice: '',
                rating: 4.7,
                reviewCount: 42,
                description: 'Experience studio-quality sound with these premium noise-cancelling headphones. Features Bluetooth 5.0, 30-hour battery life, and ultra-comfortable ear cushions.',
                sku: 'WH-1000XM4',
                inStock: true,
                image: '../assets/images/1.jpg'
            },
            '2': {
                id: '2',
                name: 'Smart Watch Series 5',
                category: 'Electronics',
                vendor: {
                    name: 'Tech Gadgets Inc.',
                    isPremium: true,
                    rating: 4.8,
                    reviewCount: 120,
                    logo: '../assets/images/1.jpg'
                },
                price: '$319.99',
                oldPrice: '$399.99',
                rating: 5.0,
                reviewCount: 78,
                description: 'Advanced smartwatch with health monitoring, GPS, always-on display, and 5-day battery life. Water-resistant up to 50m and compatible with iOS and Android.',
                sku: 'SM-5000',
                inStock: true,
                image: '../assets/images/1.jpg'
            },
            '3': {
                id: '3',
                name: 'Premium Leather Handbag',
                category: 'Fashion',
                vendor: {
                    name: 'Fashion Hub',
                    isPremium: false,
                    rating: 4.5,
                    reviewCount: 85,
                    logo: '../assets/images/1.jpg'
                },
                price: '$189.99',
                oldPrice: '',
                rating: 4.0,
                reviewCount: 35,
                description: 'Elegant designer handbag crafted from premium genuine leather. Features multiple compartments, durable hardware, and a stylish design suitable for any occasion.',
                sku: 'LH-8920',
                inStock: true,
                image: '../assets/images/1.jpg'
            }
        };

        return products[productId] || null;
    }

    /**
     * Update Quick View Modal with product details
     * @param {Object} product - Product details
     */
    function updateQuickViewModal(product) {
        const modalImage = modal.querySelector('.quick-view-image img');
        const vendorLink = modal.querySelector('.product-vendor a');
        const vendorBadge = modal.querySelector('.vendor-badge');
        const category = modal.querySelector('.product-category');
        const title = modal.querySelector('.product-title');
        const rating = modal.querySelector('.product-rating');
        const oldPrice = modal.querySelector('.old-price');
        const price = modal.querySelector('.price');
        const description = modal.querySelector('.product-description');
        const sku = modal.querySelector('.meta-item:first-child');
        const availability = modal.querySelector('.meta-item:last-child .in-stock');
        const vendorName = modal.querySelector('.vendor-name');
        const vendorRating = modal.querySelector('.vendor-rating .stars');
        const vendorReviews = modal.querySelector('.vendor-rating span');
        const vendorLogo = modal.querySelector('.vendor-logo img');
        const vendorLink2 = modal.querySelector('.view-vendor');

        // Update basic product details
        if (modalImage) modalImage.src = product.image;
        if (category) category.textContent = product.category;
        if (title) title.textContent = product.name;
        if (description) description.textContent = product.description;

        // Update pricing
        if (price) price.textContent = product.price;
        if (oldPrice) {
            if (product.oldPrice) {
                oldPrice.textContent = product.oldPrice;
                oldPrice.style.display = '';
            } else {
                oldPrice.style.display = 'none';
            }
        }

        // Update vendor info
        if (vendorLink && product.vendor) vendorLink.textContent = product.vendor.name;
        if (vendorBadge && product.vendor) {
            if (product.vendor.isPremium) {
                vendorBadge.className = 'vendor-badge premium';
                vendorBadge.innerHTML = '<i class="fas fa-crown"></i>';
            } else {
                vendorBadge.className = 'vendor-badge';
                vendorBadge.innerHTML = '';
            }
        }

        // Update ratings
        if (rating) {
            const stars = rating.querySelectorAll('i');
            const fullStars = Math.floor(product.rating);
            const hasHalfStar = product.rating % 1 >= 0.5;

            if (stars.length === 5) {
                stars.forEach((star, index) => {
                    if (index < fullStars) {
                        star.className = 'fas fa-star';
                    } else if (index === fullStars && hasHalfStar) {
                        star.className = 'fas fa-star-half-alt';
                    } else {
                        star.className = 'far fa-star';
                    }
                });
            }

            const reviewSpan = rating.querySelector('span');
            if (reviewSpan) reviewSpan.textContent = `(${product.reviewCount} reviews)`;
        }

        // Update SKU and availability
        if (sku) sku.innerHTML = `<strong>SKU:</strong> ${product.sku}`;
        if (availability) {
            availability.textContent = product.inStock ? 'In Stock' : 'Out of Stock';
            availability.className = product.inStock ? 'in-stock' : 'out-of-stock';
        }

        // Update vendor section
        if (vendorName && product.vendor) vendorName.textContent = product.vendor.name;
        if (vendorLogo && product.vendor) vendorLogo.src = product.vendor.logo;
        if (vendorRating && product.vendor) {
            const stars = vendorRating.querySelectorAll('i');
            const fullStars = Math.floor(product.vendor.rating);
            const hasHalfStar = product.vendor.rating % 1 >= 0.5;

            if (stars.length === 5) {
                stars.forEach((star, index) => {
                    if (index < fullStars) {
                        star.className = 'fas fa-star';
                    } else if (index === fullStars && hasHalfStar) {
                        star.className = 'fas fa-star-half-alt';
                    } else {
                        star.className = 'far fa-star';
                    }
                });
            }
        }
        if (vendorReviews && product.vendor) vendorReviews.textContent = `(${product.vendor.reviewCount} reviews)`;
        if (vendorLink2) vendorLink2.href = `vendor-shop.html?vendor=${product.vendor.name.toLowerCase().replace(/\s+/g, '-')}`;

        // Update quantity input
        const quantityInput = modal.querySelector('input[type="number"]');
        if (quantityInput) quantityInput.value = 1;

        // Setup quantity buttons
        const minusBtn = modal.querySelector('.quantity-btn.minus');
        const plusBtn = modal.querySelector('.quantity-btn.plus');

        if (minusBtn && plusBtn && quantityInput) {
            minusBtn.onclick = function() {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            };

            plusBtn.onclick = function() {
                const currentValue = parseInt(quantityInput.value);
                const max = parseInt(quantityInput.getAttribute('max'));
                if (!max || currentValue < max) {
                    quantityInput.value = currentValue + 1;
                }
            };
        }

        // Setup add to cart button
        const addToCartBtn = modal.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.onclick = function() {
                const quantity = parseInt(quantityInput ? quantityInput.value : 1);
                addToCart(product.id, quantity);
                closeModal(modal);
            };
        }
    }
}

/**
 * Initialize Vendor Previews
 */
function initVendorPreviews() {
    const vendorLinks = document.querySelectorAll('.product-vendor a');
    const modal = document.getElementById('vendorPreviewModal');

    if (!vendorLinks.length || !modal) return;

    vendorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const vendorName = this.textContent;
            const vendorSlug = this.getAttribute('href').split('?vendor=')[1];

            // Fetch vendor details (in a real app, this would be an API call)
            const vendorDetails = getVendorDetails(vendorSlug);
            if (vendorDetails) {
                updateVendorPreviewModal(vendorDetails);
                openModal(modal);
            }
        });
    });

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Close modal on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });

    /**
     * Get vendor details
     * @param {string} vendorSlug - Vendor slug
     * @returns {Object|null} - Vendor details or null if not found
     */
    function getVendorDetails(vendorSlug) {
        // In a real app, this would be an API call
        // Mock data for demonstration purposes
        const vendors = {
            'tech-gadgets': {
                name: 'Tech Gadgets Inc.',
                isPremium: true,
                isVerified: true,
                rating: 4.8,
                reviewCount: 120,
                description: 'Tech Gadgets Inc. specializes in high-quality consumer electronics and smart devices. With over 10 years of experience, we offer the latest technology at competitive prices, backed by our exceptional customer service.',
                logo: '../assets/images/1.jpg',
                banner: '../assets/images/1.jpg',
                productCount: 245,
                positiveFeedback: 98,
                memberSince: '2021'
            },
            'fashion-hub': {
                name: 'Fashion Hub',
                isPremium: false,
                isVerified: false,
                rating: 4.5,
                reviewCount: 85,
                description: 'Fashion Hub brings you the latest trends in clothing, accessories, and footwear from top brands around the world. We curate our collections to ensure quality and style for every occasion.',
                logo: '../assets/images/1.jpg',
                banner: '../assets/images/1.jpg',
                productCount: 176,
                positiveFeedback: 94,
                memberSince: '2022'
            },
            'home-essentials': {
                name: 'Home Essentials Co.',
                isPremium: false,
                isVerified: true,
                rating: 4.9,
                reviewCount: 203,
                description: 'Home Essentials Co. offers everything you need to transform your house into a home. From kitchen appliances to furniture and decor, we provide products that combine functionality with style.',
                logo: '../assets/images/1.jpg',
                banner: '../assets/images/1.jpg',
                productCount: 312,
                positiveFeedback: 97,
                memberSince: '2020'
            }
        };

        return vendors[vendorSlug] || null;
    }

    /**
     * Update Vendor Preview Modal with vendor details
     * @param {Object} vendor - Vendor details
     */
    function updateVendorPreviewModal(vendor) {
        const banner = modal.querySelector('.vendor-banner img');
        const logo = modal.querySelector('.vendor-logo img');
        const vendorName = modal.querySelector('.vendor-name');
        const vendorRating = modal.querySelector('.vendor-rating .stars');
        const vendorReviews = modal.querySelector('.vendor-rating span');
        const vendorDescription = modal.querySelector('.vendor-description');
        const vendorBadges = modal.querySelector('.vendor-badges');
        const feedbackStat = modal.querySelector('.stat:nth-child(1) .stat-value');
        const productStat = modal.querySelector('.stat:nth-child(2) .stat-value');
        const memberStat = modal.querySelector('.stat:nth-child(3) .stat-value');
        const visitStoreBtn = modal.querySelector('.btn-primary');

        // Update basic vendor details
        if (banner) banner.src = vendor.banner;
        if (logo) logo.src = vendor.logo;
        if (vendorName) vendorName.textContent = vendor.name;
        if (vendorDescription) vendorDescription.textContent = vendor.description;

        // Update badges
        if (vendorBadges) {
            vendorBadges.innerHTML = '';

            if (vendor.isPremium) {
                const premiumBadge = document.createElement('span');
                premiumBadge.className = 'vendor-badge premium';
                premiumBadge.innerHTML = '<i class="fas fa-crown"></i> Premium';
                vendorBadges.appendChild(premiumBadge);
            }

            if (vendor.isVerified) {
                const verifiedBadge = document.createElement('span');
                verifiedBadge.className = 'vendor-badge verified';
                verifiedBadge.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
                vendorBadges.appendChild(verifiedBadge);
            }
        }

        // Update ratings
        if (vendorRating) {
            const stars = vendorRating.querySelectorAll('i');
            const fullStars = Math.floor(vendor.rating);
            const hasHalfStar = vendor.rating % 1 >= 0.5;

            if (stars.length === 5) {
                stars.forEach((star, index) => {
                    if (index < fullStars) {
                        star.className = 'fas fa-star';
                    } else if (index === fullStars && hasHalfStar) {
                        star.className = 'fas fa-star-half-alt';
                    } else {
                        star.className = 'far fa-star';
                    }
                });
            }
        }
        if (vendorReviews) vendorReviews.textContent = `(${vendor.reviewCount} reviews)`;

        // Update stats
        if (feedbackStat) feedbackStat.textContent = vendor.positiveFeedback + '%';
        if (productStat) productStat.textContent = vendor.productCount;
        if (memberStat) memberStat.textContent = vendor.memberSince;

        // Update store link
        if (visitStoreBtn) {
            visitStoreBtn.href = `vendor-shop.html?vendor=${vendor.name.toLowerCase().replace(/\s+/g, '-')}`;
        }
    }
}

/**
 * Initialize Recently Viewed Products Carousel
 */
function initRecentlyViewed() {
    const container = document.querySelector('.products-grid.scrollable');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (!container || !prevBtn || !nextBtn) return;

    // Calculate scroll amount (one product card width + gap)
    const scrollAmount = () => {
        const card = container.querySelector('.product-card');
        if (!card) return 0;

        const cardWidth = card.offsetWidth;
        const computedStyle = window.getComputedStyle(container);
        const gap = parseInt(computedStyle.getPropertyValue('gap')) || 15;

        return cardWidth + gap;
    };

    // Scroll functions
    prevBtn.addEventListener('click', () => {
        container.scrollBy({
            left: -scrollAmount() * 2,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        container.scrollBy({
            left: scrollAmount() * 2,
            behavior: 'smooth'
        });
    });

    // Store product view in localStorage
    document.querySelectorAll('.product-card .product-title a').forEach(link => {
        link.addEventListener('click', function() {
            const productId = this.closest('.product-card').getAttribute('data-product-id');
            if (!productId) return;

            const productTitle = this.textContent;
            const productImage = this.closest('.product-card').querySelector('.product-thumb img').src;
            const productPrice = this.closest('.product-card').querySelector('.price').textContent;

            // Get existing recently viewed products
            const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

            // Check if product already exists in the list
            const existingIndex = recentlyViewed.findIndex(item => item.id === productId);
            if (existingIndex !== -1) {
                // Remove existing entry so it can be added to the front
                recentlyViewed.splice(existingIndex, 1);
            }

            // Add product to the front of the list
            recentlyViewed.unshift({
                id: productId,
                title: productTitle,
                image: productImage,
                price: productPrice
            });

            // Limit list to 10 items
            if (recentlyViewed.length > 10) {
                recentlyViewed.pop();
            }

            // Save to localStorage
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        });
    });

    // Load recently viewed products
    loadRecentlyViewed();

    /**
     * Load recently viewed products
     */
    function loadRecentlyViewed() {
        const recentlyViewedContainer = document.querySelector('.recently-viewed-carousel .products-grid');
        if (!recentlyViewedContainer) return;

        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');

        // If no recently viewed products, hide the section
        const recentlyViewedSection = document.querySelector('.recently-viewed-section');
        if (recentlyViewed.length === 0 && recentlyViewedSection) {
            recentlyViewedSection.style.display = 'none';
            return;
        }

        // Generate HTML for recently viewed products
        const productHTML = recentlyViewed.map(product => `
            <div class="product-card mini">
                <div class="product-thumb">
                    <a href="product-detail.html?id=${product.id}">
                        <img src="${product.image}" alt="${product.title}">
                    </a>
                </div>
                <div class="product-content">
                    <h3 class="product-title"><a href="product-detail.html?id=${product.id}">${product.title}</a></h3>
                    <div class="product-price">
                        <span class="price">${product.price}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add products to container
        recentlyViewedContainer.innerHTML = productHTML;
    }
}

/**
 * Initialize pagination
 */
function initPagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.btn-pagination.prev');
    const nextBtn = document.querySelector('.btn-pagination.next');

    if (!pageNumbers.length || !prevBtn || !nextBtn) return;

    // This is a static demo, so we'll just add visual interaction
    let currentPage = 1;
    const totalPages = 10; // Assuming 10 pages total

    // Page number click
    pageNumbers.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const pageNum = parseInt(this.textContent);
            if (!isNaN(pageNum)) {
                setActivePage(pageNum);
            }
        });
    });

    // Previous button click
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            setActivePage(currentPage - 1);
        }
    });

    // Next button click
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            setActivePage(currentPage + 1);
        }
    });

    /**
     * Set active page
     * @param {number} pageNum - Page number
     */
    function setActivePage(pageNum) {
        currentPage = pageNum;

        // Update active class
        pageNumbers.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.textContent) === pageNum);
        });

        // Enable/disable prev/next buttons
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Scroll to top of products section
        const shopSection = document.querySelector('.shop-section');
        if (shopSection) {
            shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // In a real app, this would fetch the next page of products
        console.log(`Loading page ${currentPage}`);
    }
}

/**
 * Load more products on scroll
 * This is a simplified version for the demo
 */
function loadMoreProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    // In a real app, this would be replaced with an intersection observer
    // to detect when the user has scrolled to the bottom of the page
    // and then load more products via an API call
}

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element
 */
function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element
 */
function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

/**
 * Add product to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity
 */
function addToCart(productId, quantity = 1) {
    // In a real app, this would be an API call or localStorage update
    console.log(`Adding product ${productId} to cart (quantity: ${quantity})`);

    // Check if cart.js has a defined addToCart function
    if (typeof window.addToCartItem === 'function') {
        window.addToCartItem(productId, quantity);
    } else {
        // Show a notification
        showNotification('Product added to cart!', 'success');

        // Update cart count
        const cartCountElements = document.querySelectorAll('.action__item.cart .count');
        cartCountElements.forEach(element => {
            const currentCount = parseInt(element.textContent) || 0;
            element.textContent = currentCount + quantity;
        });
    }
}

/**
 * Show notification
 * @param {string} message - Message to show
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if there's an existing showNotification function (from main.js)
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