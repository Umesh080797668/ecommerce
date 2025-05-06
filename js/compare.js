// Compare Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
            // Sample Product Data (in a real app, this would come from the server)
            const products = [{
                    id: 1,
                    name: "Wireless Noise Cancelling Headphones",
                    price: "$249.99",
                    image: "../assets/images/1.jpg",
                    rating: 4.5,
                    reviewCount: 42,
                    availability: "In Stock",
                    brand: "SoundMaster",
                    category: "Electronics",
                    color: ["Black", "Silver", "Blue"],
                    size: "One Size",
                    weight: "0.55 lbs",
                    dimensions: "7.5 x 6.1 x 3.2 inches",
                    material: "Premium Plastic, Metal, Memory Foam",
                    features: ["Active Noise Cancellation", "40 Hours Battery Life", "Bluetooth 5.0", "Voice Assistant Support", "Foldable Design"]
                },
                {
                    id: 2,
                    name: "Smart Watch Series 5",
                    price: "$319.99",
                    oldPrice: "$399.99",
                    image: "../assets/images/1.jpg",
                    rating: 5,
                    reviewCount: 78,
                    availability: "In Stock",
                    brand: "TechGear",
                    category: "Electronics",
                    color: ["Black", "White", "Rose Gold"],
                    size: "44mm",
                    weight: "0.22 lbs",
                    dimensions: "1.73 x 1.5 x 0.42 inches",
                    material: "Aluminum, Glass, Silicone",
                    features: ["Heart Rate Monitor", "GPS", "Water Resistant (50m)", "Cellular Connectivity", "Always-on Display"]
                },
                {
                    id: 3,
                    name: "Premium Leather Handbag",
                    price: "$189.99",
                    image: "../assets/images/1.jpg",
                    rating: 4,
                    reviewCount: 35,
                    availability: "In Stock",
                    brand: "LuxStyle",
                    category: "Fashion",
                    color: ["Brown", "Black", "Tan"],
                    size: "Medium",
                    weight: "1.8 lbs",
                    dimensions: "12 x 9 x 5 inches",
                    material: "Genuine Leather, Metal Hardware",
                    features: ["Multiple Compartments", "Detachable Strap", "Secure Zipper Closure", "Inner Pockets"]
                },
                {
                    id: 4,
                    name: "Smart Home Speaker",
                    price: "$149.99",
                    image: "../assets/images/1.jpg",
                    rating: 3.5,
                    reviewCount: 29,
                    availability: "In Stock",
                    brand: "HomeConnect",
                    category: "Electronics",
                    color: ["Charcoal", "Sand", "Aqua"],
                    size: "Standard",
                    weight: "2.1 lbs",
                    dimensions: "5.8 x 5.8 x 3.9 inches",
                    material: "Fabric, Plastic",
                    features: ["360° Sound", "Voice Control", "Smart Home Integration", "Multi-room Audio"]
                },
                {
                    id: 5,
                    name: "Premium Coffee Maker",
                    price: "$110.50",
                    oldPrice: "$129.99",
                    image: "../assets/images/1.jpg",
                    rating: 5,
                    reviewCount: 52,
                    availability: "In Stock",
                    brand: "BrewMaster",
                    category: "Home & Furniture",
                    color: ["Stainless Steel", "Black"],
                    size: "12-Cup",
                    weight: "6.5 lbs",
                    dimensions: "8 x 10 x 14 inches",
                    material: "Stainless Steel, Glass, Plastic",
                    features: ["Programmable Timer", "Auto Shut-off", "Brew Strength Control", "Anti-drip System"]
                },
                {
                    id: 6,
                    name: "Fitness Tracker Pro",
                    price: "$89.99",
                    image: "../assets/images/1.jpg",
                    rating: 4,
                    reviewCount: 47,
                    availability: "Out of Stock",
                    brand: "FitLife",
                    category: "Electronics",
                    color: ["Black", "Blue", "Red"],
                    size: "One Size",
                    weight: "0.1 lbs",
                    dimensions: "8.5 x 0.7 x 0.5 inches",
                    material: "Silicone, Plastic, Glass",
                    features: ["Step Counter", "Heart Rate Monitor", "Sleep Tracking", "Water Resistant", "7-day Battery Life"]
                }
            ];

            // DOM Elements
            const addProductBtn = document.getElementById('add-product-btn');
            const clearAllBtn = document.getElementById('clear-all');
            const productSearch = document.getElementById('product-search');
            const searchResults = document.querySelector('.search-results');
            const compareTableContainer = document.getElementById('compare-table-container');
            const compareTable = document.querySelector('.compare-table');
            const emptyCompare = document.getElementById('empty-compare');
            const productTemplate = document.getElementById('product-template');
            const compareCount = document.getElementById('compare-count');

            // Local Storage Key
            const COMPARE_STORAGE_KEY = 'shopverse_compare_products';

            // Initialize
            let compareProducts = [];
            loadCompareProducts();
            updateCompareCount();
            renderCompareTable();

            // Event Listeners
            addProductBtn.addEventListener('click', toggleProductSearch);
            clearAllBtn.addEventListener('click', clearAllProducts);
            productSearch.addEventListener('input', handleProductSearch);
            document.addEventListener('click', handleDocumentClick);

            // Compare Products Functions
            function loadCompareProducts() {
                const storedProducts = localStorage.getItem(COMPARE_STORAGE_KEY);
                if (storedProducts) {
                    compareProducts = JSON.parse(storedProducts);
                }
            }

            function saveCompareProducts() {
                localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareProducts));
            }

            function updateCompareCount() {
                compareCount.textContent = compareProducts.length;
            }

            function toggleProductSearch() {
                const dropdown = document.querySelector('.product-search-dropdown');
                dropdown.classList.toggle('active');
                if (dropdown.classList.contains('active')) {
                    productSearch.focus();
                }
            }

            function handleProductSearch() {
                const searchTerm = productSearch.value.toLowerCase();

                // Clear previous results
                searchResults.innerHTML = '';

                if (searchTerm.length < 2) return;

                // Filter products not already in compare
                const compareProductIds = compareProducts.map(p => p.id);
                const filteredProducts = products.filter(product => {
                    return !compareProductIds.includes(product.id) &&
                        product.name.toLowerCase().includes(searchTerm);
                });

                // Render search results
                filteredProducts.forEach(product => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.dataset.id = product.id;
                    resultItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="item-details">
                    <div class="item-name">${product.name}</div>
                    <div class="item-price">${product.price}</div>
                </div>
            `;
                    resultItem.addEventListener('click', () => addProductToCompare(product));
                    searchResults.appendChild(resultItem);
                });
            }

            function handleDocumentClick(event) {
                const dropdown = document.querySelector('.product-search-dropdown');
                const addProductButton = document.getElementById('add-product-btn');

                if (dropdown.classList.contains('active') &&
                    !dropdown.contains(event.target) &&
                    event.target !== addProductButton) {
                    dropdown.classList.remove('active');
                }
            }

            function addProductToCompare(product) {
                // Check if already in compare list
                if (compareProducts.some(p => p.id === product.id)) return;

                // Add product to compare list
                compareProducts.push(product);

                // Save to local storage
                saveCompareProducts();

                // Update UI
                updateCompareCount();
                renderCompareTable();

                // Close dropdown
                document.querySelector('.product-search-dropdown').classList.remove('active');
                productSearch.value = '';
            }

            function removeProductFromCompare(productId) {
                compareProducts = compareProducts.filter(product => product.id !== parseInt(productId));
                saveCompareProducts();
                updateCompareCount();
                renderCompareTable();
            }

            function clearAllProducts() {
                compareProducts = [];
                saveCompareProducts();
                updateCompareCount();
                renderCompareTable();
            }

            function renderCompareTable() {
                // Show empty state if no products
                if (compareProducts.length === 0) {
                    emptyCompare.style.display = 'block';
                    compareTableContainer.style.display = 'none';
                    return;
                }

                // Hide empty state and show table
                emptyCompare.style.display = 'none';
                compareTableContainer.style.display = 'block';

                // Clear existing product columns
                const headerRow = compareTable.querySelector('thead tr');
                const productCells = headerRow.querySelectorAll('td:not(#product-template)');
                productCells.forEach(cell => cell.remove());

                // Clear existing data rows
                const tbody = compareTable.querySelector('tbody');
                const dataRows = tbody.querySelectorAll('tr');
                dataRows.forEach(row => {
                    // Keep only the feature name cell (th)
                    const cells = row.querySelectorAll('td');
                    cells.forEach(cell => cell.remove());
                });

                // Add products to compare table
                compareProducts.forEach(product => {
                    // Add product to header row
                    const productCell = productTemplate.cloneNode(true);
                    productCell.id = '';
                    productCell.style.display = '';

                    // Set product details
                    productCell.querySelector('.product-image img').src = product.image;
                    productCell.querySelector('.product-image img').alt = product.name;
                    productCell.querySelector('.product-title a').textContent = product.name;
                    productCell.querySelector('.product-title a').href = `product-detail.html?id=${product.id}`;
                    productCell.querySelector('.product-price').innerHTML = product.oldPrice ?
                        `<span class="old-price">${product.oldPrice}</span> <span class="price">${product.price}</span>` :
                        `<span class="price">${product.price}</span>`;

                    // Set rating stars
                    const starsContainer = productCell.querySelector('.stars');
                    starsContainer.innerHTML = generateStarRating(product.rating);
                    productCell.querySelector('.rating-count').textContent = `(${product.reviewCount})`;

                    // Set availability
                    productCell.querySelector('.product-availability').innerHTML = product.availability === 'In Stock' ?
                        '<span class="in-stock"><i class="fas fa-check"></i> In Stock</span>' :
                        '<span class="out-of-stock"><i class="fas fa-times"></i> Out of Stock</span>';

                    // Set button data
                    const removeBtn = productCell.querySelector('.remove-product');
                    removeBtn.dataset.id = product.id;
                    removeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        removeProductFromCompare(product.id);
                    });

                    const addToCartBtn = productCell.querySelector('.add-to-cart');
                    addToCartBtn.dataset.id = product.id;
                    if (product.availability !== 'In Stock') {
                        addToCartBtn.classList.add('disabled');
                        addToCartBtn.disabled = true;
                        addToCartBtn.innerHTML = '<i class="fas fa-clock"></i> Notify Me';
                    }

                    // Add to header
                    headerRow.appendChild(productCell);

                    // Add cells to data rows
                    const features = [
                        { name: 'Brand', value: product.brand },
                        { name: 'Category', value: product.category },
                        { name: 'Availability', value: product.availability },
                        { name: 'Color', value: product.color },
                        { name: 'Size', value: product.size },
                        { name: 'Weight', value: product.weight },
                        { name: 'Dimensions', value: product.dimensions },
                        { name: 'Material', value: product.material },
                        { name: 'Features', value: product.features }
                    ];

                    features.forEach((feature, index) => {
                        const row = tbody.rows[index];
                        const cell = document.createElement('td');

                        if (feature.name === 'Color' && Array.isArray(feature.value)) {
                            // Render color swatches
                            const colors = feature.value.map(color => {
                                return `<span class="color-swatch" style="background-color: ${color.toLowerCase()}" title="${color}"></span>`;
                            }).join('');
                            cell.innerHTML = colors;
                        } else if (feature.name === 'Features' && Array.isArray(feature.value)) {
                            // Render features as a list
                            const featuresList = feature.value.map(feat => {
                                return `<li>${feat}</li>`;
                            }).join('');
                            cell.innerHTML = `<ul class="feature-list">${featuresList}</ul>`;
                        } else {
                            cell.innerHTML = `<span class="feature-value">${feature.value}</span>`;
                        }

                        row.appendChild(cell);
                    });
                });
            }

            function generateStarRating(rating) {
                const fullStars = Math.floor(rating);
                const halfStar = rating % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                let stars = '';

                // Full stars
                for (let i = 0; i < fullStars; i++) {
                    stars += '<i class="fas fa-star"></i>';
                }

                // Half star if needed
                if (halfStar) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                }

                // Empty stars
                for (let i = 0; i < emptyStars; i++) {
                    stars += '<i class="far fa-star"></i>';
                }

                return stars;
            }

            // Add event for add to cart buttons
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                    const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                    const productId = button.dataset.id;

                    // Here you would add the product to cart
                    // For this example, just show a notification
                    alert(`Product ID ${productId} added to cart!`);
                }
            });

            // Populate recently viewed items (sample data)
            const recentlyViewedContainer = document.getElementById('recently-viewed-products');

            // Just use some of our products as recently viewed
            const recentlyViewed = products.slice(0, 4);

            recentlyViewed.forEach(product => {
                        const productCard = document.createElement('div');
                        productCard.className = 'product-card';

                        // Product HTML structure (same as on main page)
                        productCard.innerHTML = `
            <div class="product-thumb">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <div class="product-quick-actions">
                    <a href="#" class="quick-action-btn quick-view" data-product-id="${product.id}"><i class="fas fa-eye"></i></a>
                    <a href="#" class="quick-action-btn wishlist" data-product-id="${product.id}"><i class="fas fa-heart"></i></a>
                    <a href="#" class="quick-action-btn compare" data-product-id="${product.id}"><i class="fas fa-sync-alt"></i></a>
                </div>
                <a href="#" class="add-to-cart-btn" data-product-id="${product.id}"><i class="fas fa-shopping-cart"></i> Add to Cart</a>
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title"><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                <div class="product-rating">
                    <div class="stars">${generateStarRating(product.rating)}</div>
                    <span>(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span>` : ''}
                    <span class="price">${product.price}</span>
                </div>
            </div>
        `;
        
        recentlyViewedContainer.appendChild(productCard);
    });

    // Carousel Navigation
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const scrollable = document.querySelector('.scrollable');
    
    prevBtn.addEventListener('click', () => {
        scrollable.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        scrollable.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
});