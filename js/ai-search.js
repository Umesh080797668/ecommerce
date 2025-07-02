/**
 * AI-Powered Search Functionality
 * Implements semantic search, voice search, and intelligent suggestions
 */

// AI Search state
const aiSearchState = {
    isListening: false,
    searchHistory: [],
    suggestions: [],
    recentQueries: [],
    searchIndex: null,
    isInitialized: false
};

// Mock AI search data and functions (in production, these would call real AI APIs)
const mockSearchData = {
    popularQueries: [
        'AI and machine learning',
        'Web development trends',
        'Design thinking process',
        'Sustainable business practices',
        'Remote work productivity',
        'JavaScript frameworks',
        'User experience design',
        'Digital marketing strategies'
    ],
    
    semanticMappings: {
        'ai': ['artificial intelligence', 'machine learning', 'neural networks', 'deep learning'],
        'web': ['website', 'frontend', 'backend', 'javascript', 'html', 'css'],
        'design': ['ui', 'ux', 'user interface', 'user experience', 'visual design'],
        'business': ['entrepreneur', 'startup', 'marketing', 'strategy', 'growth'],
        'lifestyle': ['wellness', 'mindfulness', 'health', 'productivity', 'work-life balance']
    }
};

// Initialize AI search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAISearch();
});

/**
 * Initialize AI search functionality
 */
function initializeAISearch() {
    const searchInput = document.getElementById('ai-search');
    const searchBtn = document.getElementById('search-btn');
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (!searchInput) return;
    
    // Load search history from localStorage
    loadSearchHistory();
    
    // Setup event listeners
    setupSearchEventListeners(searchInput, searchBtn, voiceSearchBtn, suggestionsContainer);
    
    // Initialize search index (mock implementation)
    initializeSearchIndex();
    
    aiSearchState.isInitialized = true;
    console.log('AI Search initialized successfully');
}

/**
 * Setup search event listeners
 */
function setupSearchEventListeners(searchInput, searchBtn, voiceSearchBtn, suggestionsContainer) {
    // Search input events
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    searchInput.addEventListener('focus', showSearchSuggestions);
    searchInput.addEventListener('blur', hideSearchSuggestions);
    searchInput.addEventListener('keydown', handleSearchKeydown);
    
    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Voice search
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', toggleVoiceSearch);
    }
    
    // Global click to hide suggestions
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchSuggestions();
        }
    });
}

/**
 * Handle search input changes
 */
function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length === 0) {
        showRecentQueries();
        return;
    }
    
    if (query.length < 2) {
        hideSearchSuggestions();
        return;
    }
    
    // Generate AI-powered suggestions
    generateSearchSuggestions(query);
}

/**
 * Handle search keydown events
 */
function handleSearchKeydown(e) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    const activeSuggestion = suggestionsContainer?.querySelector('.suggestion-item.active');
    
    switch (e.key) {
        case 'Enter':
            e.preventDefault();
            if (activeSuggestion) {
                selectSuggestion(activeSuggestion.textContent);
            } else {
                performSearch();
            }
            break;
            
        case 'ArrowDown':
            e.preventDefault();
            navigateSuggestions('down');
            break;
            
        case 'ArrowUp':
            e.preventDefault();
            navigateSuggestions('up');
            break;
            
        case 'Escape':
            hideSearchSuggestions();
            e.target.blur();
            break;
    }
}

/**
 * Generate AI-powered search suggestions
 */
function generateSearchSuggestions(query) {
    const suggestions = [];
    
    // Add exact matches from blog posts
    const exactMatches = findExactMatches(query);
    suggestions.push(...exactMatches);
    
    // Add semantic matches
    const semanticMatches = findSemanticMatches(query);
    suggestions.push(...semanticMatches);
    
    // Add popular completions
    const popularCompletions = findPopularCompletions(query);
    suggestions.push(...popularCompletions);
    
    // Remove duplicates and limit results
    const uniqueSuggestions = [...new Set(suggestions)].slice(0, 8);
    
    aiSearchState.suggestions = uniqueSuggestions;
    displaySearchSuggestions(uniqueSuggestions, query);
}

/**
 * Find exact matches in blog content
 */
function findExactMatches(query) {
    const matches = [];
    const queryLower = query.toLowerCase();
    
    // Search through blog posts (using mock data)
    if (window.blogState && window.blogState.posts) {
        window.blogState.posts.forEach(post => {
            if (post.title.toLowerCase().includes(queryLower)) {
                matches.push(post.title);
            }
            
            post.tags.forEach(tag => {
                if (tag.toLowerCase().includes(queryLower)) {
                    matches.push(tag);
                }
            });
        });
    }
    
    return matches.slice(0, 3);
}

/**
 * Find semantic matches using AI mappings
 */
function findSemanticMatches(query) {
    const matches = [];
    const queryLower = query.toLowerCase();
    
    // Check semantic mappings
    Object.keys(mockSearchData.semanticMappings).forEach(key => {
        if (queryLower.includes(key) || key.includes(queryLower)) {
            const relatedTerms = mockSearchData.semanticMappings[key];
            matches.push(...relatedTerms.filter(term => 
                !term.toLowerCase().includes(queryLower)
            ));
        }
    });
    
    return matches.slice(0, 3);
}

/**
 * Find popular query completions
 */
function findPopularCompletions(query) {
    const queryLower = query.toLowerCase();
    
    return mockSearchData.popularQueries
        .filter(popularQuery => 
            popularQuery.toLowerCase().includes(queryLower) &&
            popularQuery.toLowerCase() !== queryLower
        )
        .slice(0, 3);
}

/**
 * Display search suggestions
 */
function displaySearchSuggestions(suggestions, query) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;
    
    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }
    
    const suggestionsHTML = suggestions.map((suggestion, index) => `
        <div class="suggestion-item" data-index="${index}" onclick="selectSuggestion('${suggestion}')">
            <i class="fas fa-search"></i>
            <span class="suggestion-text">${highlightQuery(suggestion, query)}</span>
            <i class="fas fa-arrow-up-right suggestion-action"></i>
        </div>
    `).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.classList.add('show');
}

/**
 * Show recent queries as suggestions
 */
function showRecentQueries() {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer || aiSearchState.recentQueries.length === 0) return;
    
    const recentHTML = aiSearchState.recentQueries.slice(0, 5).map((query, index) => `
        <div class="suggestion-item recent-query" data-index="${index}" onclick="selectSuggestion('${query}')">
            <i class="fas fa-history"></i>
            <span class="suggestion-text">${query}</span>
            <button class="remove-recent" onclick="removeRecentQuery('${query}')" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    suggestionsContainer.innerHTML = `
        <div class="suggestions-header">Recent Searches</div>
        ${recentHTML}
    `;
    suggestionsContainer.classList.add('show');
}

/**
 * Highlight query terms in suggestions
 */
function highlightQuery(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Navigate through suggestions with keyboard
 */
function navigateSuggestions(direction) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    const items = suggestionsContainer?.querySelectorAll('.suggestion-item');
    
    if (!items || items.length === 0) return;
    
    const activeItem = suggestionsContainer.querySelector('.suggestion-item.active');
    let nextIndex = 0;
    
    if (activeItem) {
        const currentIndex = parseInt(activeItem.getAttribute('data-index'));
        activeItem.classList.remove('active');
        
        if (direction === 'down') {
            nextIndex = (currentIndex + 1) % items.length;
        } else {
            nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        }
    }
    
    items[nextIndex].classList.add('active');
}

/**
 * Select a suggestion
 */
function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('ai-search');
    if (searchInput) {
        searchInput.value = suggestion;
        hideSearchSuggestions();
        performSearch();
    }
}

/**
 * Remove a recent query
 */
function removeRecentQuery(query) {
    aiSearchState.recentQueries = aiSearchState.recentQueries.filter(q => q !== query);
    saveSearchHistory();
    showRecentQueries();
    event.stopPropagation();
}

/**
 * Show search suggestions
 */
function showSearchSuggestions() {
    const searchInput = document.getElementById('ai-search');
    const query = searchInput?.value.trim();
    
    if (!query) {
        showRecentQueries();
    } else if (query.length >= 2) {
        generateSearchSuggestions(query);
    }
}

/**
 * Hide search suggestions
 */
function hideSearchSuggestions() {
    setTimeout(() => {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('show');
        }
    }, 150);
}

/**
 * Perform search
 */
function performSearch() {
    const searchInput = document.getElementById('ai-search');
    const query = searchInput?.value.trim();
    
    if (!query) return;
    
    // Add to search history
    addToSearchHistory(query);
    
    // Hide suggestions
    hideSearchSuggestions();
    
    // Perform AI-enhanced search
    executeAISearch(query);
    
    // Track analytics
    if (typeof trackEvent === 'function') {
        trackEvent('blog_search', {
            query: query,
            source: 'ai_search'
        });
    }
}

/**
 * Execute AI-enhanced search
 */
function executeAISearch(query) {
    console.log('Performing AI search for:', query);
    
    // Show loading state
    showSearchLoading();
    
    // Simulate AI processing delay
    setTimeout(() => {
        const results = performSemanticSearch(query);
        displaySearchResults(results, query);
        hideSearchLoading();
    }, 1000);
}

/**
 * Perform semantic search
 */
function performSemanticSearch(query) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    // Get blog posts
    const posts = window.blogState?.posts || [];
    
    // Calculate relevance scores
    posts.forEach(post => {
        let score = 0;
        
        // Title match (highest weight)
        if (post.title.toLowerCase().includes(queryLower)) {
            score += 10;
        }
        
        // Tag match
        post.tags.forEach(tag => {
            if (tag.toLowerCase().includes(queryLower)) {
                score += 5;
            }
        });
        
        // Category match
        if (post.category.toLowerCase().includes(queryLower)) {
            score += 3;
        }
        
        // Content match (excerpt)
        if (post.excerpt.toLowerCase().includes(queryLower)) {
            score += 2;
        }
        
        // Semantic matching
        Object.keys(mockSearchData.semanticMappings).forEach(key => {
            if (queryLower.includes(key)) {
                const relatedTerms = mockSearchData.semanticMappings[key];
                relatedTerms.forEach(term => {
                    if (post.title.toLowerCase().includes(term) ||
                        post.excerpt.toLowerCase().includes(term) ||
                        post.tags.some(tag => tag.toLowerCase().includes(term))) {
                        score += 1;
                    }
                });
            }
        });
        
        if (score > 0) {
            results.push({
                post: post,
                score: score,
                relevance: calculateRelevance(post, query)
            });
        }
    });
    
    // Sort by score and relevance
    results.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.relevance - a.relevance;
    });
    
    return results.slice(0, 10);
}

/**
 * Calculate relevance score using AI-like factors
 */
function calculateRelevance(post, query) {
    let relevance = 0;
    
    // Recency boost
    const daysSincePublished = (Date.now() - new Date(post.publishedAt)) / (1000 * 60 * 60 * 24);
    relevance += Math.max(0, 30 - daysSincePublished) * 0.1;
    
    // Popularity boost
    relevance += (post.views / 1000) * 0.5;
    relevance += (post.likes / 100) * 0.3;
    
    // AI enhancement boost
    if (post.aiEnhanced) {
        relevance += 2;
    }
    
    // SEO score boost
    relevance += (post.seoScore / 100) * 1;
    
    return relevance;
}

/**
 * Display search results
 */
function displaySearchResults(results, query) {
    const grid = document.getElementById('blog-posts-grid');
    if (!grid) return;
    
    if (results.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No results found</h3>
                <p>We couldn't find any articles matching "${query}". Try different keywords or browse our categories.</p>
                <div class="search-suggestions-alt">
                    <h4>You might be interested in:</h4>
                    <div class="suggestion-tags">
                        ${mockSearchData.popularQueries.slice(0, 4).map(suggestion => 
                            `<button class="tag-suggestion" onclick="selectSuggestion('${suggestion}')">${suggestion}</button>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Display search results header
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'search-results-header';
    resultsHeader.innerHTML = `
        <h3>Search Results for "${query}"</h3>
        <p>Found ${results.length} relevant articles</p>
        <button class="clear-search-btn" onclick="clearSearch()">
            <i class="fas fa-times"></i> Clear Search
        </button>
    `;
    
    // Clear grid and add header
    grid.innerHTML = '';
    grid.appendChild(resultsHeader);
    
    // Add search results
    results.forEach((result, index) => {
        const postElement = createSearchResultElement(result.post, result.score, query);
        postElement.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(postElement);
    });
    
    // Update page title
    document.title = `Search: ${query} | ShopVerse Blog`;
    
    // Scroll to results
    grid.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Create search result element
 */
function createSearchResultElement(post, score, query) {
    const article = document.createElement('article');
    article.className = 'blog-card search-result fade-in';
    article.setAttribute('data-post-id', post.id);
    article.setAttribute('data-score', score);
    
    article.innerHTML = `
        <div class="search-relevance">
            <span class="relevance-score" title="Relevance Score">${score}</span>
        </div>
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
            </div>
            <h3 class="post-title">
                <a href="blog-post.html?id=${post.id}">${highlightQuery(post.title, query)}</a>
            </h3>
            <p class="post-excerpt">${highlightQuery(post.excerpt, query)}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag ${tag.toLowerCase().includes(query.toLowerCase()) ? 'highlighted' : ''}">${tag}</span>`).join('')}
            </div>
            <div class="post-actions">
                <button class="action-btn like-btn" data-post-id="${post.id}">
                    <i class="far fa-heart"></i> <span>${post.likes}</span>
                </button>
                <button class="action-btn bookmark-btn" data-post-id="${post.id}">
                    <i class="far fa-bookmark"></i>
                </button>
                <button class="action-btn share-btn" data-post-id="${post.id}">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
    `;
    
    return article;
}

/**
 * Clear search and return to normal view
 */
function clearSearch() {
    const searchInput = document.getElementById('ai-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reload blog posts
    if (typeof loadBlogPosts === 'function') {
        loadBlogPosts();
    }
    
    // Reset page title
    document.title = 'Blog | ShopVerse - AI-Powered Insights';
}

/**
 * Toggle voice search
 */
function toggleVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Voice search is not supported in this browser', 'error');
        return;
    }
    
    if (aiSearchState.isListening) {
        stopVoiceSearch();
    } else {
        startVoiceSearch();
    }
}

/**
 * Start voice search
 */
function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    const voiceBtn = document.getElementById('voice-search-btn');
    const searchInput = document.getElementById('ai-search');
    
    recognition.onstart = function() {
        aiSearchState.isListening = true;
        voiceBtn.classList.add('listening');
        voiceBtn.title = 'Listening... Click to stop';
        searchInput.placeholder = 'Listening...';
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        performSearch();
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        showNotification('Voice search error. Please try again.', 'error');
        stopVoiceSearch();
    };
    
    recognition.onend = function() {
        stopVoiceSearch();
    };
    
    aiSearchState.recognition = recognition;
    recognition.start();
}

/**
 * Stop voice search
 */
function stopVoiceSearch() {
    if (aiSearchState.recognition) {
        aiSearchState.recognition.stop();
    }
    
    aiSearchState.isListening = false;
    
    const voiceBtn = document.getElementById('voice-search-btn');
    const searchInput = document.getElementById('ai-search');
    
    if (voiceBtn) {
        voiceBtn.classList.remove('listening');
        voiceBtn.title = 'Voice Search';
    }
    
    if (searchInput) {
        searchInput.placeholder = 'Search articles with AI...';
    }
}

/**
 * Show search loading state
 */
function showSearchLoading() {
    const grid = document.getElementById('blog-posts-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="search-loading">
                <div class="ai-thinking">
                    <div class="ai-brain">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div class="thinking-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <h3>AI is analyzing your search...</h3>
                <p>Using semantic understanding to find the most relevant content</p>
            </div>
        `;
    }
}

/**
 * Hide search loading state
 */
function hideSearchLoading() {
    // Loading state will be replaced by search results
}

/**
 * Add query to search history
 */
function addToSearchHistory(query) {
    // Remove if already exists
    aiSearchState.recentQueries = aiSearchState.recentQueries.filter(q => q !== query);
    
    // Add to beginning
    aiSearchState.recentQueries.unshift(query);
    
    // Limit to 10 recent queries
    aiSearchState.recentQueries = aiSearchState.recentQueries.slice(0, 10);
    
    // Save to localStorage
    saveSearchHistory();
}

/**
 * Save search history to localStorage
 */
function saveSearchHistory() {
    try {
        localStorage.setItem('blog_search_history', JSON.stringify(aiSearchState.recentQueries));
    } catch (error) {
        console.warn('Could not save search history:', error);
    }
}

/**
 * Load search history from localStorage
 */
function loadSearchHistory() {
    try {
        const saved = localStorage.getItem('blog_search_history');
        if (saved) {
            aiSearchState.recentQueries = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Could not load search history:', error);
        aiSearchState.recentQueries = [];
    }
}

/**
 * Initialize search index (mock implementation)
 */
function initializeSearchIndex() {
    // In a real implementation, this would build a search index
    // using libraries like Fuse.js or Lunr.js
    console.log('Search index initialized');
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

function showNotification(message, type = 'info') {
    if (typeof window.showSystemNotification === 'function') {
        window.showSystemNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Export functions for global use
window.initializeAISearch = initializeAISearch;
window.selectSuggestion = selectSuggestion;
window.removeRecentQuery = removeRecentQuery;
window.clearSearch = clearSearch;