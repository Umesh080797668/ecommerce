/**
 * ShopVerse E-commerce Platform
 * FAQ Page JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ page components
    initCategoryNavigation();
    initFaqToggle();
    initSearch();
    initPopularSearches();
    initLiveChat();
});

/**
 * Initialize category navigation functionality
 */
function initCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('.category-item a');
    const categories = document.querySelectorAll('.faq-category');

    if (!categoryLinks.length || !categories.length) return;

    // Handle category link clicks
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetCategoryId = this.getAttribute('data-category');
            const targetCategory = document.getElementById(`${targetCategoryId}-content`);

            if (!targetCategory) return;

            // Update active category link
            categoryLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');

            // Show target category, hide others
            categories.forEach(category => {
                category.classList.remove('active');
            });
            targetCategory.classList.add('active');

            // Hide search results if visible
            document.querySelector('.search-results').style.display = 'none';

            // Update URL hash for direct linking
            window.location.hash = targetCategoryId;

            // Scroll to top of FAQ main content on mobile
            if (window.innerWidth < 768) {
                document.querySelector('.faq-main').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Check URL hash on load to navigate to specific category
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.category-item a[data-category="${hash}"]`);

        if (targetLink) {
            targetLink.click();
        }
    }
}

/**
 * Initialize FAQ item toggle functionality
 */
function initFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close other FAQ items in the same category (optional, comment out to allow multiple open)
            const parentList = item.closest('.faq-list');
            if (parentList) {
                const siblingItems = parentList.querySelectorAll('.faq-item');
                siblingItems.forEach(sibling => {
                    if (sibling !== item) {
                        sibling.classList.remove('active');
                    }
                });
            }

            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('faq-search');
    const searchButton = document.getElementById('search-btn');
    const clearSearchButton = document.querySelector('.btn-clear-search');
    const searchResults = document.querySelector('.search-results');
    const searchTermSpan = document.querySelector('.search-term');
    const resultsCount = document.querySelector('.results-count .count');
    const resultsList = document.querySelector('.results-list');
    const categoriesContent = document.querySelector('.faq-categories-content');

    if (!searchInput || !searchButton || !searchResults) return;

    // Function to perform search
    const performSearch = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm.length < 2) {
            showNotification('Please enter at least 2 characters to search', 'info');
            return;
        }

        // Hide categories content, show search results
        categoriesContent.style.display = 'none';
        searchResults.style.display = 'block';

        // Update search term display
        searchTermSpan.textContent = searchTerm;

        // Get all FAQ items across all categories
        const allFaqItems = document.querySelectorAll('.faq-item');
        const matchingResults = [];

        // Search through all FAQ items
        allFaqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            const category = item.closest('.faq-category').id.replace('-content', '');
            const categoryTitle = document.querySelector(`.category-item a[data-category="${category}"]`).textContent;

            // Check if search term appears in question or answer
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                matchingResults.push({
                    question: item.querySelector('.faq-question h3').textContent,
                    snippet: getSnippet(answer, searchTerm),
                    category: category,
                    categoryTitle: categoryTitle
                });
            }
        });

        // Update results count
        resultsCount.textContent = matchingResults.length;

        // Display results
        if (matchingResults.length > 0) {
            let resultsHTML = '';

            matchingResults.forEach(result => {
                resultsHTML += `
                    <div class="search-result-item">
                        <span class="result-category">${result.categoryTitle}</span>
                        <h3 class="result-title">${highlightSearchTerm(result.question, searchTerm)}</h3>
                        <p class="result-snippet">${highlightSearchTerm(result.snippet, searchTerm)}</p>
                        <a href="#${result.category}" class="result-link" data-category="${result.category}" data-question="${result.question}">
                            View Answer <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
            });

            resultsList.innerHTML = resultsHTML;

            // Add click event for result links
            document.querySelectorAll('.result-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();

                    const category = this.getAttribute('data-category');
                    const question = this.getAttribute('data-question');

                    // Navigate to category
                    document.querySelector(`.category-item a[data-category="${category}"]`).click();

                    // Find and open the specific FAQ item
                    setTimeout(() => {
                        const faqItems = document.querySelectorAll(`#${category}-content .faq-item`);
                        faqItems.forEach(item => {
                            const itemQuestion = item.querySelector('.faq-question h3').textContent;
                            if (itemQuestion === question) {
                                item.classList.add('active');
                                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        });
                    }, 300);
                });
            });
        } else {
            resultsList.innerHTML = `
                                                    <div class="no-results">
                                                        <p>No matches found for "${searchTerm}". Please try another search term.</p>
                                                        <div class="search-suggestions">
                                                            <h4>Suggestions:</h4>
                                                            <ul>
                                                                <li>Check the spelling of your search term</li>
                                                                <li>Try using more general keywords</li>
                                                                <li>Browse our FAQ categories on the left</li>
                                                                <li>Contact support if you can't find what you're looking for</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                `;
        }
    };

    // Helper function to get text snippet around search term
    const getSnippet = (text, term) => {
        const lowerText = text.toLowerCase();
        const index = lowerText.indexOf(term);

        if (index === -1) return text.substring(0, 150) + '...';

        // Get snippet with search term in the middle
        const start = Math.max(0, index - 60);
        const end = Math.min(text.length, index + term.length + 60);
        let snippet = text.substring(start, end);

        // Add ellipsis if needed
        if (start > 0) snippet = '...' + snippet;
        if (end < text.length) snippet = snippet + '...';

        return snippet;
    };

    // Helper function to highlight search term in text
    const highlightSearchTerm = (text, term) => {
        if (!term) return text;

        const regex = new RegExp('(' + term + ')', 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    // Search button click event
    searchButton.addEventListener('click', performSearch);

    // Enter key press in search input
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Clear search results
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', () => {
            searchInput.value = '';
            categoriesContent.style.display = 'block';
            searchResults.style.display = 'none';

            // Auto-focus search input
            searchInput.focus();
        });
    }
}

/**
 * Initialize popular searches functionality
 */
function initPopularSearches() {
    const popularSearchLinks = document.querySelectorAll('.popular-searches a');
    const searchInput = document.getElementById('faq-search');
    const searchButton = document.getElementById('search-btn');

    if (!popularSearchLinks.length || !searchInput || !searchButton) return;

    popularSearchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const searchTerm = this.getAttribute('data-search');
            searchInput.value = searchTerm;
            searchButton.click();
        });
    });
}

/**
 * Initialize live chat functionality
 */
function initLiveChat() {
    const chatButton = document.getElementById('chat-button');
    const chatWidget = document.getElementById('chat-widget');
    const closeChat = document.getElementById('close-chat');
    const openChat = document.getElementById('open-chat');
    const sendMessage = document.getElementById('send-message');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.querySelector('.chat-messages');

    if (!chatButton || !chatWidget) return;

    // Open chat from floating button
    chatButton.addEventListener('click', () => {
        chatWidget.style.display = 'flex';
        chatButton.style.display = 'none';
        chatInput.focus();
    });

    // Open chat from support option
    if (openChat) {
        openChat.addEventListener('click', (e) => {
            e.preventDefault();
            chatWidget.style.display = 'flex';
            chatButton.style.display = 'none';
            chatInput.focus();
        });
    }

    // Close chat
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWidget.style.display = 'none';
            chatButton.style.display = 'flex';
        });
    }

    // Send message functionality
    if (sendMessage && chatInput) {
        const sendChatMessage = () => {
            const message = chatInput.value.trim();

            if (message) {
                // Add user message to chat
                const currentTime = getCurrentTime();

                chatMessages.innerHTML += `
                                                        <div class="message user">
                                                            <div class="message-content">
                                                                <p>${message}</p>
                                                            </div>
                                                            <span class="message-time">${currentTime}</span>
                                                        </div>
                                                    `;

                // Clear input
                chatInput.value = '';

                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Simulate agent response after a short delay
                setTimeout(() => {
                    // Sample automated response
                    const responses = [
                        "Thanks for reaching out! Our team will review your message and get back to you soon.",
                        "I understand you have a question about that. Let me connect you with a specialist who can help you better.",
                        "Thank you for your message. A customer service representative will be with you shortly.",
                        "I've received your inquiry. While you wait, you might find your answer in our FAQ section above."
                    ];

                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

                    chatMessages.innerHTML += `
                                                            <div class="message agent">
                                                                <div class="message-content">
                                                                    <p>${randomResponse}</p>
                                                                </div>
                                                                <span class="message-time">${getCurrentTime()}</span>
                                                            </div>
                                                        `;

                    // Scroll to bottom
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        };

        sendMessage.addEventListener('click', sendChatMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    // Helper function to get current time for chat messages
    function getCurrentTime() {
        return '2025-05-05 14:59:18'; // Using the fixed time provided
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
 * Update user information with the current user's login
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright');

    copyrightElements.forEach(element => {
        element.textContent = element.textContent.replace(/\d{4}/, currentYear);
    });
});