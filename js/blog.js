/**
 * Blog Page Main Functionality
 * Handles blog post loading, filtering, animations, and interactions
 */

// Blog state management
const blogState = {
    currentPage: 1,
    postsPerPage: 12,
    totalPosts: 0,
    loading: false,
    posts: [],
    filters: {
        category: 'all',
        sort: 'latest',
        readingTime: 'all'
    },
    viewMode: 'grid'
};

// Mock blog data (in a real app, this would come from an API)
const mockBlogPosts = [
    {
        id: 1,
        title: "The AI Revolution: How Machine Learning is Transforming Industries",
        excerpt: "Discover how artificial intelligence is reshaping the business landscape and what it means for the future of work...",
        content: "Full article content here...",
        featuredImage: "../assets/images/blog/ai-revolution.jpg",
        category: "technology",
        tags: ["AI", "Machine Learning", "Technology"],
        author: {
            name: "John Doe",
            avatar: "../assets/images/avatars/author-1.jpg",
            bio: "AI Researcher and Tech Writer"
        },
        publishedAt: "2024-12-28",
        readingTime: 8,
        likes: 124,
        shares: 45,
        views: 2840,
        featured: true,
        aiEnhanced: true,
        sentiment: 0.85,
        seoScore: 92
    },
    {
        id: 2,
        title: "Future of Web Development: Trends to Watch in 2025",
        excerpt: "Explore the cutting-edge technologies and frameworks that will define web development in the coming year...",
        content: "Full article content here...",
        featuredImage: "../assets/images/blog/web-dev-trends.jpg",
        category: "programming",
        tags: ["Web Development", "React", "JavaScript"],
        author: {
            name: "Jane Smith",
            avatar: "../assets/images/avatars/author-2.jpg",
            bio: "Senior Frontend Developer"
        },
        publishedAt: "2024-12-27",
        readingTime: 5,
        likes: 89,
        shares: 32,
        views: 1960,
        featured: true,
        aiEnhanced: false,
        sentiment: 0.78,
        seoScore: 88
    },
    {
        id: 3,
        title: "Design Thinking: Creating User-Centered Experiences",
        excerpt: "Learn the principles of design thinking and how to apply them to create products that truly resonate with users...",
        content: "Full article content here...",
        featuredImage: "../assets/images/blog/design-thinking.jpg",
        category: "design",
        tags: ["Design", "UX", "User Experience"],
        author: {
            name: "Mike Johnson",
            avatar: "../assets/images/avatars/author-3.jpg",
            bio: "UX Designer and Design Strategist"
        },
        publishedAt: "2024-12-26",
        readingTime: 6,
        likes: 156,
        shares: 67,
        views: 3240,
        featured: true,
        aiEnhanced: true,
        sentiment: 0.92,
        seoScore: 95
    },
    {
        id: 4,
        title: "Sustainable Business Practices for Modern Entrepreneurs",
        excerpt: "Discover how to build a profitable business while making a positive impact on the environment and society...",
        content: "Full article content here...",
        featuredImage: "../assets/images/blog/sustainable-business.jpg",
        category: "business",
        tags: ["Business", "Sustainability", "Entrepreneurship"],
        author: {
            name: "Sarah Wilson",
            avatar: "../assets/images/avatars/author-4.jpg",
            bio: "Business Consultant and Sustainability Expert"
        },
        publishedAt: "2024-12-25",
        readingTime: 7,
        likes: 203,
        shares: 89,
        views: 4150,
        featured: false,
        aiEnhanced: true,
        sentiment: 0.88,
        seoScore: 91
    },
    {
        id: 5,
        title: "Mindful Living: Finding Balance in a Digital World",
        excerpt: "Practical tips for maintaining mental health and well-being in our increasingly connected world...",
        content: "Full article content here...",
        featuredImage: "../assets/images/blog/mindful-living.jpg",
        category: "lifestyle",
        tags: ["Lifestyle", "Mindfulness", "Mental Health"],
        author: {
            name: "Dr. Emily Chen",
            avatar: "../assets/images/avatars/author-5.jpg",
            bio: "Wellness Coach and Psychologist"
        },
        publishedAt: "2024-12-24",
        readingTime: 4,
        likes: 178,
        shares: 54,
        views: 2890,
        featured: false,
        aiEnhanced: false,
        sentiment: 0.94,
        seoScore: 87
    }
];

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    setupEventListeners();
    setupScrollAnimations();
    initializeHero3D();
    loadBlogPosts();
});

/**
 * Initialize blog functionality
 */
function initializeBlog() {
    // Set initial state
    blogState.posts = mockBlogPosts;
    blogState.totalPosts = mockBlogPosts.length;
    
    // Initialize counters animation
    animateCounters();
    
    // Setup intersection observer for scroll animations
    setupScrollAnimations();
    
    // Initialize AI search
    if (typeof initializeAISearch === 'function') {
        initializeAISearch();
    }
    
    console.log('Blog initialized successfully');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Category navigation
    const categoryLinks = document.querySelectorAll('[data-category]');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    // Filter controls
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const readingTimeFilter = document.getElementById('reading-time-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            blogState.filters.category = this.value;
            applyFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            blogState.filters.sort = this.value;
            applyFilters();
        });
    }
    
    if (readingTimeFilter) {
        readingTimeFilter.addEventListener('change', function() {
            blogState.filters.readingTime = this.value;
            applyFilters();
        });
    }
    
    // View toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            toggleView(view);
        });
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
    
    // Post actions (like, bookmark, share)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) {
            handleLike(e.target.closest('.like-btn'));
        } else if (e.target.closest('.bookmark-btn')) {
            handleBookmark(e.target.closest('.bookmark-btn'));
        } else if (e.target.closest('.share-btn')) {
            handleShare(e.target.closest('.share-btn'));
        }
    });
}

/**
 * Load and display blog posts
 */
function loadBlogPosts() {
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) return;
    
    // Show loading state
    showLoadingState();
    
    // Simulate API delay
    setTimeout(() => {
        const filteredPosts = getFilteredPosts();
        const paginatedPosts = paginatePosts(filteredPosts);
        
        if (blogState.currentPage === 1) {
            grid.innerHTML = '';
        }
        
        paginatedPosts.forEach((post, index) => {
            const postElement = createPostElement(post);
            postElement.style.animationDelay = `${index * 0.1}s`;
            grid.appendChild(postElement);
        });
        
        hideLoadingState();
        
        // Update load more button
        updateLoadMoreButton(filteredPosts.length);
        
        // Trigger scroll animations
        triggerScrollAnimations();
        
    }, 1000);
}

/**
 * Create blog post element
 */
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-card fade-in';
    article.setAttribute('data-post-id', post.id);
    
    article.innerHTML = `
        <div class="post-image">
            <img src="${post.featuredImage}" alt="${post.title}" loading="lazy">
            <div class="post-overlay">
                <div class="post-category">${capitalizeFirst(post.category)}</div>
                <div class="post-reading-time">
                    <i class="fas fa-clock"></i> ${post.readingTime} min read
                </div>
            </div>
            ${post.aiEnhanced ? '<div class="post-ai-badge"><i class="fas fa-robot"></i> AI Enhanced</div>' : ''}
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span class="post-author">
                    <img src="${post.author.avatar}" alt="${post.author.name}">
                    ${post.author.name}
                </span>
                <span class="post-date">${formatDate(post.publishedAt)}</span>
                <div class="post-views">
                    <i class="fas fa-eye"></i> ${formatNumber(post.views)}
                </div>
            </div>
            <h3 class="post-title">
                <a href="blog-post.html?id=${post.id}">${post.title}</a>
            </h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" data-post-id="${post.id}">
                    <i class="far fa-heart"></i> <span>${post.likes}</span>
                </button>
                <button class="action-btn bookmark-btn" data-post-id="${post.id}">
                    <i class="far fa-bookmark"></i>
                </button>
                <button class="action-btn share-btn" data-post-id="${post.id}">
                    <i class="fas fa-share-alt"></i> <span>${post.shares}</span>
                </button>
                <div class="post-sentiment">
                    <span class="sentiment-score" title="AI Sentiment Score">
                        <i class="fas fa-smile"></i> ${Math.round(post.sentiment * 100)}%
                    </span>
                </div>
            </div>
        </div>
    `;
    
    return article;
}

/**
 * Filter posts by category
 */
function filterByCategory(category) {
    // Update navigation
    const navLinks = document.querySelectorAll('.blog-nav__item');
    navLinks.forEach(item => item.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-category="${category}"]`).closest('.blog-nav__item');
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Update filter state
    blogState.filters.category = category;
    blogState.currentPage = 1;
    
    // Apply filters
    applyFilters();
}

/**
 * Apply current filters
 */
function applyFilters() {
    blogState.currentPage = 1;
    loadBlogPosts();
}

/**
 * Get filtered posts based on current filters
 */
function getFilteredPosts() {
    let filteredPosts = [...blogState.posts];
    
    // Filter by category
    if (blogState.filters.category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === blogState.filters.category);
    }
    
    // Filter by reading time
    if (blogState.filters.readingTime !== 'all') {
        switch (blogState.filters.readingTime) {
            case 'quick':
                filteredPosts = filteredPosts.filter(post => post.readingTime < 5);
                break;
            case 'medium':
                filteredPosts = filteredPosts.filter(post => post.readingTime >= 5 && post.readingTime <= 10);
                break;
            case 'long':
                filteredPosts = filteredPosts.filter(post => post.readingTime > 10);
                break;
        }
    }
    
    // Sort posts
    switch (blogState.filters.sort) {
        case 'latest':
            filteredPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            break;
        case 'popular':
            filteredPosts.sort((a, b) => b.views - a.views);
            break;
        case 'trending':
            filteredPosts.sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares));
            break;
        case 'ai-recommended':
            filteredPosts.sort((a, b) => b.seoScore - a.seoScore);
            break;
    }
    
    return filteredPosts;
}

/**
 * Paginate posts
 */
function paginatePosts(posts) {
    const startIndex = (blogState.currentPage - 1) * blogState.postsPerPage;
    const endIndex = startIndex + blogState.postsPerPage;
    return posts.slice(startIndex, endIndex);
}

/**
 * Toggle view mode
 */
function toggleView(view) {
    blogState.viewMode = view;
    
    // Update buttons
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === view);
    });
    
    // Update grid
    const grid = document.getElementById('blog-posts-grid');
    if (grid) {
        grid.classList.toggle('list-view', view === 'list');
    }
}

/**
 * Load more posts
 */
function loadMorePosts() {
    if (blogState.loading) return;
    
    blogState.currentPage++;
    loadBlogPosts();
}

/**
 * Show loading state
 */
function showLoadingState() {
    blogState.loading = true;
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
    }
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    blogState.loading = false;
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Articles';
        loadMoreBtn.disabled = false;
    }
}

/**
 * Update load more button visibility
 */
function updateLoadMoreButton(totalFilteredPosts) {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    
    const postsShown = blogState.currentPage * blogState.postsPerPage;
    const container = loadMoreBtn.closest('.load-more-container');
    
    if (postsShown >= totalFilteredPosts) {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
    }
}

/**
 * Handle like action
 */
function handleLike(button) {
    const postId = button.getAttribute('data-post-id');
    const isLiked = button.classList.contains('active');
    
    button.classList.toggle('active');
    
    const countSpan = button.querySelector('span');
    const currentCount = parseInt(countSpan.textContent);
    
    if (isLiked) {
        countSpan.textContent = currentCount - 1;
        button.querySelector('i').className = 'far fa-heart';
    } else {
        countSpan.textContent = currentCount + 1;
        button.querySelector('i').className = 'fas fa-heart';
    }
    
    // Update post data
    const post = blogState.posts.find(p => p.id == postId);
    if (post) {
        post.likes = isLiked ? post.likes - 1 : post.likes + 1;
    }
    
    // Track analytics
    if (typeof trackEvent === 'function') {
        trackEvent('blog_post_like', {
            postId: postId,
            action: isLiked ? 'unlike' : 'like'
        });
    }
}

/**
 * Handle bookmark action
 */
function handleBookmark(button) {
    const postId = button.getAttribute('data-post-id');
    const isBookmarked = button.classList.contains('active');
    
    button.classList.toggle('active');
    
    if (isBookmarked) {
        button.querySelector('i').className = 'far fa-bookmark';
        showNotification('Removed from bookmarks', 'info');
    } else {
        button.querySelector('i').className = 'fas fa-bookmark';
        showNotification('Added to bookmarks', 'success');
    }
    
    // Track analytics
    if (typeof trackEvent === 'function') {
        trackEvent('blog_post_bookmark', {
            postId: postId,
            action: isBookmarked ? 'remove' : 'add'
        });
    }
}

/**
 * Handle share action
 */
function handleShare(button) {
    const postId = button.getAttribute('data-post-id');
    const post = blogState.posts.find(p => p.id == postId);
    
    if (!post) return;
    
    // Create share modal or use Web Share API
    if (navigator.share) {
        navigator.share({
            title: post.title,
            text: post.excerpt,
            url: `${window.location.origin}/pages/blog-post.html?id=${postId}`
        });
    } else {
        // Fallback to custom share modal
        showShareModal(post);
    }
    
    // Update share count
    const countSpan = button.querySelector('span');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = currentCount + 1;
        post.shares = currentCount + 1;
    }
    
    // Track analytics
    if (typeof trackEvent === 'function') {
        trackEvent('blog_post_share', {
            postId: postId,
            title: post.title
        });
    }
}

/**
 * Show share modal
 */
function showShareModal(post) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Share Article</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="share-options">
                <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn twitter">
                    <i class="fab fa-twitter"></i> Twitter
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn facebook">
                    <i class="fab fa-facebook"></i> Facebook
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn linkedin">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
                <button class="share-btn copy-link" data-url="${window.location.href}">
                    <i class="fas fa-copy"></i> Copy Link
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Copy link functionality
    modal.querySelector('.copy-link').addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
            document.body.removeChild(modal);
        });
    });
}

/**
 * Handle newsletter submission
 */
function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const button = form.querySelector('button');
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        form.reset();
        button.innerHTML = originalText;
        button.disabled = false;
        
        showNotification('Successfully subscribed to newsletter!', 'success');
        
        // Track analytics
        if (typeof trackEvent === 'function') {
            trackEvent('newsletter_subscription', {
                email: email,
                source: 'blog_page'
            });
        }
    }, 1500);
}

/**
 * Initialize 3D hero scene
 */
function initializeHero3D() {
    const sceneContainer = document.getElementById('hero-3d-scene');
    if (!sceneContainer || typeof THREE === 'undefined') return;
    
    try {
        // Create scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sceneContainer.offsetWidth / sceneContainer.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);
        renderer.setClearColor(0x000000, 0);
        sceneContainer.appendChild(renderer.domElement);
        
        // Create floating geometries
        const geometries = [];
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0x4a6cf7, transparent: true, opacity: 0.8 }),
            new THREE.MeshPhongMaterial({ color: 0x764ba2, transparent: true, opacity: 0.8 }),
            new THREE.MeshPhongMaterial({ color: 0x667eea, transparent: true, opacity: 0.8 })
        ];
        
        // Create various geometric shapes
        for (let i = 0; i < 15; i++) {
            let geometry;
            const shapeType = Math.floor(Math.random() * 4);
            
            switch (shapeType) {
                case 0:
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                    break;
                case 1:
                    geometry = new THREE.SphereGeometry(0.5, 16, 16);
                    break;
                case 2:
                    geometry = new THREE.OctahedronGeometry(0.7);
                    break;
                case 3:
                    geometry = new THREE.TetrahedronGeometry(0.8);
                    break;
            }
            
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.set(
                Math.random() * 20 - 10,
                Math.random() * 10 - 5,
                Math.random() * 10 - 5
            );
            
            // Random rotation
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Random scale
            const scale = Math.random() * 0.5 + 0.5;
            mesh.scale.set(scale, scale, scale);
            
            scene.add(mesh);
            geometries.push(mesh);
        }
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        scene.add(directionalLight);
        
        // Position camera
        camera.position.z = 15;
        
        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate geometries
            geometries.forEach((mesh, index) => {
                mesh.rotation.x += 0.005 * (index % 3 + 1);
                mesh.rotation.y += 0.003 * (index % 2 + 1);
                mesh.rotation.z += 0.002 * (index % 4 + 1);
                
                // Float animation
                mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            });
            
            // Camera movement based on mouse
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = sceneContainer.offsetWidth / sceneContainer.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);
        });
        
    } catch (error) {
        console.warn('3D scene initialization failed:', error);
    }
}

/**
 * Animate counters in hero section
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 20);
    });
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Trigger scroll animations for new elements
 */
function triggerScrollAnimations() {
    const newElements = document.querySelectorAll('.blog-card:not(.revealed)');
    newElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('revealed');
        }, index * 100);
    });
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    if (typeof window.showSystemNotification === 'function') {
        window.showSystemNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Export functions for use in other modules
window.blogState = blogState;
window.loadBlogPosts = loadBlogPosts;
window.filterByCategory = filterByCategory;