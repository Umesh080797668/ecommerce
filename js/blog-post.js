/**
 * Blog Post Page Functionality
 * Handles reading progress, table of contents, social sharing, and interactions
 */

// Blog post state
const blogPostState = {
    postId: null,
    readingTime: 0,
    startTime: null,
    scrollProgress: 0,
    isBookmarked: false,
    isLiked: false,
    currentSection: null,
    commentsLoaded: false
};

// Initialize blog post functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogPost();
    setupReadingProgress();
    setupTableOfContents();
    setupSocialSharing();
    setupFloatingActions();
    setupCodeHighlighting();
    loadRelatedArticles();
    initializeComments();
});

/**
 * Initialize blog post
 */
function initializeBlogPost() {
    // Get post ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    blogPostState.postId = urlParams.get('id') || '1';
    
    // Track page view
    blogPostState.startTime = Date.now();
    
    // Setup intersection observers
    setupSectionObserver();
    
    // Track reading analytics
    if (typeof trackEvent === 'function') {
        trackEvent('blog_post_view', {
            postId: blogPostState.postId,
            title: document.title
        });
    }
    
    console.log('Blog post initialized');
}

/**
 * Setup reading progress bar
 */
function setupReadingProgress() {
    const progressBar = document.getElementById('reading-progress-bar');
    const articleBody = document.querySelector('.article-body');
    
    if (!progressBar || !articleBody) return;
    
    function updateProgress() {
        const articleTop = articleBody.offsetTop;
        const articleHeight = articleBody.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const articleBottom = articleTop + articleHeight - windowHeight;
        const scrollProgress = Math.max(0, Math.min(1, (scrollTop - articleTop) / (articleBottom - articleTop)));
        
        blogPostState.scrollProgress = scrollProgress;
        progressBar.style.width = `${scrollProgress * 100}%`;
        
        // Show/hide scroll to top button
        const scrollTopBtn = document.querySelector('.scroll-top-fab');
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', scrollTop > 500);
        }
        
        // Track reading progress milestones
        trackReadingMilestones(scrollProgress);
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

/**
 * Track reading progress milestones
 */
function trackReadingMilestones(progress) {
    const milestones = [0.25, 0.5, 0.75, 1.0];
    
    milestones.forEach(milestone => {
        const eventKey = `reading_${Math.round(milestone * 100)}`;
        
        if (progress >= milestone && !sessionStorage.getItem(eventKey)) {
            sessionStorage.setItem(eventKey, 'true');
            
            if (typeof trackEvent === 'function') {
                trackEvent('reading_progress', {
                    postId: blogPostState.postId,
                    milestone: milestone,
                    timeSpent: Date.now() - blogPostState.startTime
                });
            }
        }
    });
}

/**
 * Setup table of contents
 */
function setupTableOfContents() {
    const tocNav = document.querySelector('.table-of-contents');
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    
    if (!tocNav || headings.length === 0) return;
    
    // Generate TOC
    const tocHTML = generateTOC(headings);
    tocNav.innerHTML = tocHTML;
    
    // Setup click handlers
    const tocLinks = tocNav.querySelectorAll('a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offset = 120; // Account for sticky header
                const elementPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveTOCLink(this);
            }
        });
    });
}

/**
 * Generate table of contents HTML
 */
function generateTOC(headings) {
    let tocHTML = '<ul>';
    let currentLevel = 2;
    
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent;
        const id = heading.id || `section-${index}`;
        
        // Ensure heading has an ID
        if (!heading.id) {
            heading.id = id;
        }
        
        if (level > currentLevel) {
            tocHTML += '<ul>';
        } else if (level < currentLevel) {
            tocHTML += '</ul>';
        }
        
        tocHTML += `<li><a href="#${id}">${text}</a></li>`;
        currentLevel = level;
    });
    
    tocHTML += '</ul>';
    return tocHTML;
}

/**
 * Update active TOC link
 */
function updateActiveTOCLink(activeLink) {
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    tocLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

/**
 * Setup section observer for TOC highlighting
 */
function setupSectionObserver() {
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    
    if (headings.length === 0) return;
    
    const observerOptions = {
        rootMargin: '-120px 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const tocLink = document.querySelector(`.table-of-contents a[href="#${id}"]`);
                
                if (tocLink) {
                    updateActiveTOCLink(tocLink);
                    blogPostState.currentSection = id;
                }
            }
        });
    }, observerOptions);
    
    headings.forEach(heading => observer.observe(heading));
}

/**
 * Setup social sharing
 */
function setupSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    
    shareButtons.forEach(button => {
        const platform = button.getAttribute('data-platform');
        
        if (platform) {
            const shareUrl = generateShareURL(platform, url, title);
            button.setAttribute('href', shareUrl);
            button.setAttribute('target', '_blank');
            button.setAttribute('rel', 'noopener noreferrer');
        }
        
        button.addEventListener('click', function(e) {
            if (platform === 'copy-link' || button.classList.contains('copy-link')) {
                e.preventDefault();
                copyToClipboard(url);
            } else {
                // Track social share
                if (typeof trackEvent === 'function') {
                    trackEvent('social_share', {
                        platform: platform,
                        postId: blogPostState.postId,
                        url: url
                    });
                }
            }
        });
    });
    
    // Main share button in header
    const shareArticleBtn = document.querySelector('.share-article-btn');
    if (shareArticleBtn) {
        shareArticleBtn.addEventListener('click', openShareModal);
    }
}

/**
 * Generate share URL for different platforms
 */
function generateShareURL(platform, url, title) {
    const encodedURL = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    const shareURLs = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedURL}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedURL}`,
        telegram: `https://t.me/share/url?url=${encodedURL}&text=${encodedTitle}`
    };
    
    return shareURLs[platform] || '#';
}

/**
 * Open share modal
 */
function openShareModal() {
    const url = window.location.href;
    const title = document.querySelector('.article-title').textContent;
    
    // Try native sharing first
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(err => {
            console.log('Share cancelled or failed');
        });
        return;
    }
    
    // Fallback to custom modal
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-overlay"></div>
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Share this article</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="share-options">
                <button class="share-option twitter" data-platform="twitter">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                </button>
                <button class="share-option facebook" data-platform="facebook">
                    <i class="fab fa-facebook"></i>
                    <span>Facebook</span>
                </button>
                <button class="share-option linkedin" data-platform="linkedin">
                    <i class="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                </button>
                <button class="share-option whatsapp" data-platform="whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </button>
                <button class="share-option copy-link">
                    <i class="fas fa-copy"></i>
                    <span>Copy Link</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Setup modal events
    const closeBtn = modal.querySelector('.close-btn');
    const overlay = modal.querySelector('.share-modal-overlay');
    const shareOptions = modal.querySelectorAll('.share-option');
    
    function closeModal() {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    shareOptions.forEach(option => {
        option.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            
            if (platform) {
                const shareUrl = generateShareURL(platform, url, title);
                window.open(shareUrl, '_blank', 'noopener,noreferrer');
            } else if (this.classList.contains('copy-link')) {
                copyToClipboard(url);
            }
            
            closeModal();
        });
    });
}

/**
 * Setup floating action buttons
 */
function setupFloatingActions() {
    const bookmarkFab = document.querySelector('.bookmark-fab');
    const shareFab = document.querySelector('.share-fab');
    const scrollTopFab = document.querySelector('.scroll-top-fab');
    
    // Bookmark functionality
    if (bookmarkFab) {
        // Load bookmark state
        const isBookmarked = localStorage.getItem(`bookmark_${blogPostState.postId}`) === 'true';
        updateBookmarkButton(bookmarkFab, isBookmarked);
        
        bookmarkFab.addEventListener('click', function() {
            toggleBookmark(this);
        });
    }
    
    // Share functionality
    if (shareFab) {
        shareFab.addEventListener('click', openShareModal);
    }
    
    // Scroll to top functionality
    if (scrollTopFab) {
        scrollTopFab.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Like and bookmark buttons in article
    const likeBtn = document.querySelector('.article-actions .like-btn');
    const bookmarkBtn = document.querySelector('.article-actions .bookmark-btn');
    
    if (likeBtn) {
        const isLiked = localStorage.getItem(`like_${blogPostState.postId}`) === 'true';
        updateLikeButton(likeBtn, isLiked);
        likeBtn.addEventListener('click', () => toggleLike(likeBtn));
    }
    
    if (bookmarkBtn) {
        const isBookmarked = localStorage.getItem(`bookmark_${blogPostState.postId}`) === 'true';
        updateBookmarkButton(bookmarkBtn, isBookmarked);
        bookmarkBtn.addEventListener('click', () => toggleBookmark(bookmarkBtn));
    }
}

/**
 * Toggle bookmark state
 */
function toggleBookmark(button) {
    const isBookmarked = button.classList.contains('active');
    const newState = !isBookmarked;
    
    updateBookmarkButton(button, newState);
    
    // Save state
    localStorage.setItem(`bookmark_${blogPostState.postId}`, newState);
    blogPostState.isBookmarked = newState;
    
    // Show notification
    const message = newState ? 'Article bookmarked!' : 'Bookmark removed';
    showNotification(message, newState ? 'success' : 'info');
    
    // Track analytics
    if (typeof trackEvent === 'function') {
        trackEvent('article_bookmark', {
            postId: blogPostState.postId,
            action: newState ? 'add' : 'remove'
        });
    }
}

/**
 * Toggle like state
 */
function toggleLike(button) {
    const isLiked = button.classList.contains('active');
    const newState = !isLiked;
    
    updateLikeButton(button, newState);
    
    // Save state
    localStorage.setItem(`like_${blogPostState.postId}`, newState);
    blogPostState.isLiked = newState;
    
    // Update like count
    const countSpan = button.querySelector('span');
    if (countSpan) {
        const currentCount = parseInt(countSpan.textContent);
        countSpan.textContent = newState ? currentCount + 1 : currentCount - 1;
    }
    
    // Track analytics
    if (typeof trackEvent === 'function') {
        trackEvent('article_like', {
            postId: blogPostState.postId,
            action: newState ? 'like' : 'unlike'
        });
    }
}

/**
 * Update bookmark button appearance
 */
function updateBookmarkButton(button, isBookmarked) {
    button.classList.toggle('active', isBookmarked);
    const icon = button.querySelector('i');
    if (icon) {
        icon.className = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
    }
}

/**
 * Update like button appearance
 */
function updateLikeButton(button, isLiked) {
    button.classList.toggle('active', isLiked);
    const icon = button.querySelector('i');
    if (icon) {
        icon.className = isLiked ? 'fas fa-heart' : 'far fa-heart';
    }
}

/**
 * Setup code syntax highlighting
 */
function setupCodeHighlighting() {
    if (typeof hljs !== 'undefined') {
        // Initialize highlight.js
        hljs.highlightAll();
        
        // Add copy buttons to code blocks
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(addCopyButton);
    }
}

/**
 * Add copy button to code block
 */
function addCopyButton(codeBlock) {
    const pre = codeBlock.parentElement;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-code-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.title = 'Copy code';
    
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(copyBtn);
    wrapper.appendChild(pre);
    
    copyBtn.addEventListener('click', function() {
        const code = codeBlock.textContent;
        copyToClipboard(code);
        
        // Update button state
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.classList.add('copied');
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i>';
            this.classList.remove('copied');
        }, 2000);
    });
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

/**
 * Fallback copy method
 */
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

/**
 * Load related articles
 */
function loadRelatedArticles() {
    const relatedGrid = document.querySelector('.related-grid');
    if (!relatedGrid) return;
    
    // Mock related articles (in production, this would be an API call)
    const relatedArticles = [
        {
            id: 2,
            title: "Future of Web Development: Trends to Watch in 2025",
            excerpt: "Explore the cutting-edge technologies and frameworks that will define web development...",
            image: "../assets/images/blog/web-dev-trends.jpg",
            category: "Programming",
            readingTime: 5,
            author: "Jane Smith"
        },
        {
            id: 3,
            title: "Design Thinking: Creating User-Centered Experiences",
            excerpt: "Learn the principles of design thinking and how to apply them...",
            image: "../assets/images/blog/design-thinking.jpg",
            category: "Design",
            readingTime: 6,
            author: "Mike Johnson"
        },
        {
            id: 4,
            title: "Sustainable Business Practices for Modern Entrepreneurs",
            excerpt: "Discover how to build a profitable business while making a positive impact...",
            image: "../assets/images/blog/sustainable-business.jpg",
            category: "Business",
            readingTime: 7,
            author: "Sarah Wilson"
        }
    ];
    
    const relatedHTML = relatedArticles.map(article => `
        <article class="related-article">
            <div class="related-image">
                <img src="${article.image}" alt="${article.title}" loading="lazy">
                <div class="related-overlay">
                    <span class="related-category">${article.category}</span>
                </div>
            </div>
            <div class="related-content">
                <h4><a href="blog-post.html?id=${article.id}">${article.title}</a></h4>
                <p>${article.excerpt}</p>
                <div class="related-meta">
                    <span class="related-author">${article.author}</span>
                    <span class="related-reading-time">${article.readingTime} min read</span>
                </div>
            </div>
        </article>
    `).join('');
    
    relatedGrid.innerHTML = relatedHTML;
}

/**
 * Initialize comments functionality
 */
function initializeComments() {
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    
    if (commentForm) {
        setupCommentForm(commentForm);
    }
    
    if (commentsList) {
        loadComments();
    }
}

/**
 * Setup comment form
 */
function setupCommentForm(form) {
    const textarea = form.querySelector('textarea');
    const charCount = form.querySelector('.character-count .current');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Character counter
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            const current = this.value.length;
            charCount.textContent = current;
            
            // Update submit button state
            if (submitBtn) {
                submitBtn.disabled = current < 10 || current > 1000;
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitComment(this);
    });
}

/**
 * Submit comment
 */
function submitComment(form) {
    const textarea = form.querySelector('textarea');
    const comment = textarea.value.trim();
    
    if (comment.length < 10) {
        showNotification('Comment must be at least 10 characters long', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        form.reset();
        form.querySelector('.character-count .current').textContent = '0';
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Comment posted successfully! It will appear after moderation.', 'success');
        
        // Track analytics
        if (typeof trackEvent === 'function') {
            trackEvent('comment_posted', {
                postId: blogPostState.postId,
                commentLength: comment.length
            });
        }
        
        // Reload comments (in production, add the new comment optimistically)
        setTimeout(loadComments, 1000);
        
    }, 1500);
}

/**
 * Load comments
 */
function loadComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList || blogPostState.commentsLoaded) return;
    
    // Mock comments data
    const comments = [
        {
            id: 1,
            author: "Tech Enthusiast",
            avatar: "../assets/images/avatars/commenter-1.jpg",
            content: "Great article! The insights on AI transformation are really valuable. I've been working in the healthcare industry and can confirm the impact AI is having on diagnostic accuracy.",
            timestamp: "2 hours ago",
            likes: 12,
            replies: [
                {
                    id: 2,
                    author: "John Doe",
                    avatar: "../assets/images/avatars/author-1.jpg",
                    content: "Thank you for the feedback! Healthcare is definitely one of the most exciting areas for AI development. Would love to hear more about your specific experiences.",
                    timestamp: "1 hour ago",
                    likes: 5,
                    isAuthor: true
                }
            ]
        },
        {
            id: 3,
            author: "Data Scientist",
            avatar: "../assets/images/avatars/commenter-2.jpg",
            content: "The section on machine learning applications in finance is spot on. We're seeing tremendous improvements in fraud detection algorithms. The only challenge is ensuring fairness and avoiding bias in these systems.",
            timestamp: "4 hours ago",
            likes: 8,
            replies: []
        }
    ];
    
    const commentsHTML = comments.map(comment => renderComment(comment)).join('');
    commentsList.innerHTML = commentsHTML;
    
    // Update comment count
    const commentCount = document.querySelector('.comment-count');
    if (commentCount) {
        const totalComments = comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);
        commentCount.textContent = `(${totalComments})`;
    }
    
    blogPostState.commentsLoaded = true;
}

/**
 * Render comment HTML
 */
function renderComment(comment, isReply = false) {
    const replyClass = isReply ? 'comment-reply' : '';
    const authorBadge = comment.isAuthor ? '<span class="author-badge">Author</span>' : '';
    
    let html = `
        <div class="comment ${replyClass}" data-comment-id="${comment.id}">
            <div class="comment-avatar">
                <img src="${comment.avatar}" alt="${comment.author}">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    ${authorBadge}
                    <span class="comment-timestamp">${comment.timestamp}</span>
                </div>
                <div class="comment-text">${comment.content}</div>
                <div class="comment-actions">
                    <button class="comment-action like-comment" data-comment-id="${comment.id}">
                        <i class="far fa-heart"></i> ${comment.likes}
                    </button>
                    <button class="comment-action reply-comment">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add replies
    if (comment.replies && comment.replies.length > 0) {
        html += '<div class="comment-replies">';
        comment.replies.forEach(reply => {
            html += renderComment(reply, true);
        });
        html += '</div>';
    }
    
    return html;
}

/**
 * Track reading time when page unloads
 */
window.addEventListener('beforeunload', function() {
    if (blogPostState.startTime) {
        const readingTime = Date.now() - blogPostState.startTime;
        
        if (typeof trackEvent === 'function') {
            trackEvent('reading_time', {
                postId: blogPostState.postId,
                timeSpent: readingTime,
                scrollProgress: blogPostState.scrollProgress
            });
        }
    }
});

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    if (typeof window.showSystemNotification === 'function') {
        window.showSystemNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Export functions for global use
window.blogPostState = blogPostState;
window.toggleBookmark = toggleBookmark;
window.toggleLike = toggleLike;