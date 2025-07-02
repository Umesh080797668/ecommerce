/**
 * Real-Time Comments System
 * Handles comment posting, real-time updates, and AI moderation
 */

// Comments state
const commentsState = {
    comments: [],
    currentUser: null,
    replyingTo: null,
    isConnected: false,
    socket: null,
    moderationEnabled: true
};

// Mock Socket.io connection (in production, this would connect to a real server)
const mockSocket = {
    connected: false,
    listeners: {},
    
    connect() {
        this.connected = true;
        setTimeout(() => {
            this.emit('connect');
        }, 1000);
    },
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    },
    
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    },
    
    disconnect() {
        this.connected = false;
        this.emit('disconnect');
    }
};

// Initialize comments system
document.addEventListener('DOMContentLoaded', function() {
    initializeCommentsSystem();
});

/**
 * Initialize the comments system
 */
function initializeCommentsSystem() {
    // Setup mock socket connection
    setupSocketConnection();
    
    // Load existing comments
    loadExistingComments();
    
    // Setup event listeners
    setupCommentEventListeners();
    
    console.log('Comments system initialized');
}

/**
 * Setup socket connection for real-time updates
 */
function setupSocketConnection() {
    commentsState.socket = mockSocket;
    
    // Connect to server
    commentsState.socket.connect();
    
    // Setup socket event listeners
    commentsState.socket.on('connect', () => {
        commentsState.isConnected = true;
        console.log('Connected to comment server');
        showNotification('Connected to real-time comments', 'success');
    });
    
    commentsState.socket.on('disconnect', () => {
        commentsState.isConnected = false;
        console.log('Disconnected from comment server');
        showNotification('Disconnected from real-time comments', 'warning');
    });
    
    commentsState.socket.on('new_comment', (comment) => {
        handleNewComment(comment);
    });
    
    commentsState.socket.on('comment_updated', (comment) => {
        handleCommentUpdate(comment);
    });
    
    commentsState.socket.on('comment_moderated', (data) => {
        handleCommentModeration(data);
    });
}

/**
 * Load existing comments
 */
function loadExistingComments() {
    // Mock comments data
    const existingComments = [
        {
            id: 1,
            author: "Tech Enthusiast",
            avatar: "../assets/images/avatars/commenter-1.jpg",
            content: "Great article! The insights on AI transformation are really valuable. I've been working in the healthcare industry and can confirm the impact AI is having on diagnostic accuracy.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            likes: 12,
            replies: [
                {
                    id: 2,
                    author: "John Doe",
                    avatar: "../assets/images/avatars/author-1.jpg",
                    content: "Thank you for the feedback! Healthcare is definitely one of the most exciting areas for AI development. Would love to hear more about your specific experiences.",
                    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
                    likes: 5,
                    isAuthor: true,
                    parentId: 1
                }
            ],
            sentiment: 0.85,
            isModerated: true
        },
        {
            id: 3,
            author: "Data Scientist",
            avatar: "../assets/images/avatars/commenter-2.jpg",
            content: "The section on machine learning applications in finance is spot on. We're seeing tremendous improvements in fraud detection algorithms. The only challenge is ensuring fairness and avoiding bias in these systems.",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            likes: 8,
            replies: [],
            sentiment: 0.78,
            isModerated: true
        }
    ];
    
    commentsState.comments = existingComments;
    renderComments();
}

/**
 * Setup comment event listeners
 */
function setupCommentEventListeners() {
    // Comment form submission
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmission);
    }
    
    // Character counter
    const commentTextarea = commentForm?.querySelector('textarea');
    const charCounter = document.querySelector('.character-count .current');
    
    if (commentTextarea && charCounter) {
        commentTextarea.addEventListener('input', function() {
            charCounter.textContent = this.value.length;
            
            // Update submit button state
            const submitBtn = commentForm.querySelector('button[type="submit"]');
            const isValid = this.value.trim().length >= 10 && this.value.length <= 1000;
            submitBtn.disabled = !isValid;
        });
    }
    
    // Comment actions (like, reply, etc.)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-comment')) {
            handleCommentLike(e.target.closest('.like-comment'));
        } else if (e.target.closest('.reply-comment')) {
            handleCommentReply(e.target.closest('.reply-comment'));
        } else if (e.target.closest('.report-comment')) {
            handleCommentReport(e.target.closest('.report-comment'));
        }
    });
    
    // Comment sorting
    const sortSelect = document.querySelector('.comment-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortComments(this.value);
        });
    }
}

/**
 * Handle comment form submission
 */
function handleCommentSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const textarea = form.querySelector('textarea');
    const content = textarea.value.trim();
    
    if (content.length < 10) {
        showNotification('Comment must be at least 10 characters long', 'error');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
    submitBtn.disabled = true;
    
    // Create new comment object
    const newComment = {
        id: Date.now(),
        author: "Anonymous User", // In production, get from authenticated user
        avatar: "../assets/images/avatars/default-user.jpg",
        content: content,
        timestamp: new Date(),
        likes: 0,
        replies: [],
        parentId: commentsState.replyingTo,
        isModerated: false,
        sentiment: null
    };
    
    // Simulate AI moderation check
    setTimeout(() => {
        performAIModeration(newComment).then(moderatedComment => {
            // Add comment to state
            if (moderatedComment.parentId) {
                // This is a reply
                const parentComment = findComment(moderatedComment.parentId);
                if (parentComment) {
                    parentComment.replies.push(moderatedComment);
                }
            } else {
                // This is a top-level comment
                commentsState.comments.unshift(moderatedComment);
            }
            
            // Reset form
            form.reset();
            form.querySelector('.character-count .current').textContent = '0';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Clear reply state
            if (commentsState.replyingTo) {
                clearReplyState();
            }
            
            // Re-render comments
            renderComments();
            
            // Show success message
            const message = moderatedComment.isModerated ? 
                'Comment posted successfully!' : 
                'Comment submitted for moderation.';
            showNotification(message, 'success');
            
            // Emit to socket for real-time updates
            if (commentsState.socket && commentsState.isConnected) {
                commentsState.socket.emit('new_comment', moderatedComment);
            }
            
            // Track analytics
            if (typeof trackEvent === 'function') {
                trackEvent('comment_posted', {
                    postId: window.blogPostState?.postId,
                    commentLength: content.length,
                    isReply: !!moderatedComment.parentId,
                    sentiment: moderatedComment.sentiment
                });
            }
            
        });
    }, 1500);
}

/**
 * Perform AI moderation on comment
 */
async function performAIModeration(comment) {
    // Simulate AI analysis
    const analysis = await simulateAIAnalysis(comment.content);
    
    comment.sentiment = analysis.sentiment;
    comment.toxicity = analysis.toxicity;
    comment.isModerated = analysis.toxicity < 0.3; // Auto-approve if toxicity is low
    
    return comment;
}

/**
 * Simulate AI content analysis
 */
function simulateAIAnalysis(content) {
    return new Promise(resolve => {
        setTimeout(() => {
            // Simple sentiment analysis simulation
            const positiveWords = ['great', 'excellent', 'amazing', 'love', 'fantastic', 'good', 'helpful'];
            const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'stupid'];
            const toxicWords = ['spam', 'scam', 'fake', 'clickbait'];
            
            const words = content.toLowerCase().split(' ');
            let sentimentScore = 0.5; // neutral
            let toxicityScore = 0;
            
            words.forEach(word => {
                if (positiveWords.includes(word)) sentimentScore += 0.1;
                if (negativeWords.includes(word)) sentimentScore -= 0.1;
                if (toxicWords.includes(word)) toxicityScore += 0.2;
            });
            
            // Clamp values
            sentimentScore = Math.max(0, Math.min(1, sentimentScore));
            toxicityScore = Math.max(0, Math.min(1, toxicityScore));
            
            resolve({
                sentiment: sentimentScore,
                toxicity: toxicityScore,
                confidence: 0.85
            });
        }, 800);
    });
}

/**
 * Handle new comment from socket
 */
function handleNewComment(comment) {
    // Check if comment already exists (avoid duplicates)
    if (findComment(comment.id)) return;
    
    if (comment.parentId) {
        const parentComment = findComment(comment.parentId);
        if (parentComment) {
            parentComment.replies.push(comment);
        }
    } else {
        commentsState.comments.unshift(comment);
    }
    
    renderComments();
    
    // Show notification for new comments from others
    if (comment.author !== commentsState.currentUser?.name) {
        showNotification(`New comment from ${comment.author}`, 'info');
    }
}

/**
 * Handle comment like
 */
function handleCommentLike(button) {
    const commentId = parseInt(button.getAttribute('data-comment-id'));
    const comment = findComment(commentId);
    
    if (!comment) return;
    
    const isLiked = button.classList.contains('liked');
    
    if (isLiked) {
        comment.likes = Math.max(0, comment.likes - 1);
        button.classList.remove('liked');
    } else {
        comment.likes += 1;
        button.classList.add('liked');
    }
    
    // Update button text
    button.innerHTML = `<i class="far fa-heart"></i> ${comment.likes}`;
    
    // Emit to socket
    if (commentsState.socket && commentsState.isConnected) {
        commentsState.socket.emit('comment_liked', {
            commentId: commentId,
            action: isLiked ? 'unlike' : 'like'
        });
    }
    
    // Track analytics
    if (typeof trackEvent === 'function') {
        trackEvent('comment_like', {
            commentId: commentId,
            action: isLiked ? 'unlike' : 'like'
        });
    }
}

/**
 * Handle comment reply
 */
function handleCommentReply(button) {
    const commentElement = button.closest('.comment');
    const commentId = parseInt(commentElement.getAttribute('data-comment-id'));
    const authorName = commentElement.querySelector('.comment-author').textContent;
    
    commentsState.replyingTo = commentId;
    
    // Update form to show reply state
    const form = document.getElementById('comment-form');
    const textarea = form.querySelector('textarea');
    
    // Add reply indicator
    let replyIndicator = form.querySelector('.reply-indicator');
    if (!replyIndicator) {
        replyIndicator = document.createElement('div');
        replyIndicator.className = 'reply-indicator';
        form.insertBefore(replyIndicator, textarea);
    }
    
    replyIndicator.innerHTML = `
        <div class="reply-to">
            <i class="fas fa-reply"></i>
            Replying to <strong>${authorName}</strong>
            <button type="button" class="cancel-reply" onclick="clearReplyState()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Focus textarea
    textarea.focus();
    textarea.placeholder = `Reply to ${authorName}...`;
}

/**
 * Clear reply state
 */
function clearReplyState() {
    commentsState.replyingTo = null;
    
    const form = document.getElementById('comment-form');
    const textarea = form.querySelector('textarea');
    const replyIndicator = form.querySelector('.reply-indicator');
    
    if (replyIndicator) {
        replyIndicator.remove();
    }
    
    textarea.placeholder = 'Share your thoughts on AI transformation...';
}

/**
 * Handle comment report
 */
function handleCommentReport(button) {
    const commentId = parseInt(button.getAttribute('data-comment-id'));
    
    if (confirm('Report this comment as inappropriate?')) {
        // Emit report to socket
        if (commentsState.socket && commentsState.isConnected) {
            commentsState.socket.emit('comment_reported', {
                commentId: commentId,
                reason: 'inappropriate_content'
            });
        }
        
        showNotification('Comment reported. Thank you for helping keep our community safe.', 'success');
        
        // Track analytics
        if (typeof trackEvent === 'function') {
            trackEvent('comment_reported', {
                commentId: commentId
            });
        }
    }
}

/**
 * Find comment by ID (including replies)
 */
function findComment(id) {
    for (const comment of commentsState.comments) {
        if (comment.id === id) return comment;
        
        for (const reply of comment.replies) {
            if (reply.id === id) return reply;
        }
    }
    return null;
}

/**
 * Sort comments
 */
function sortComments(sortBy) {
    switch (sortBy) {
        case 'newest':
            commentsState.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            break;
        case 'oldest':
            commentsState.comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            break;
        case 'popular':
            commentsState.comments.sort((a, b) => b.likes - a.likes);
            break;
    }
    
    renderComments();
}

/**
 * Render all comments
 */
function renderComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    const commentsHTML = commentsState.comments.map(comment => renderComment(comment)).join('');
    commentsList.innerHTML = commentsHTML;
    
    // Update comment count
    const totalComments = commentsState.comments.reduce((total, comment) => {
        return total + 1 + comment.replies.length;
    }, 0);
    
    const commentCount = document.querySelector('.comment-count');
    if (commentCount) {
        commentCount.textContent = `(${totalComments})`;
    }
}

/**
 * Render a single comment
 */
function renderComment(comment, isReply = false) {
    const timeAgo = getTimeAgo(comment.timestamp);
    const replyClass = isReply ? 'comment-reply' : '';
    const authorBadge = comment.isAuthor ? '<span class="author-badge">Author</span>' : '';
    const moderationBadge = !comment.isModerated ? '<span class="moderation-badge">Pending Moderation</span>' : '';
    const sentimentIcon = getSentimentIcon(comment.sentiment);
    
    let html = `
        <div class="comment ${replyClass}" data-comment-id="${comment.id}">
            <div class="comment-avatar">
                <img src="${comment.avatar}" alt="${comment.author}" loading="lazy">
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    ${authorBadge}
                    ${moderationBadge}
                    <span class="comment-timestamp">${timeAgo}</span>
                    ${sentimentIcon}
                </div>
                <div class="comment-text">${comment.content}</div>
                <div class="comment-actions">
                    <button class="comment-action like-comment" data-comment-id="${comment.id}">
                        <i class="far fa-heart"></i> ${comment.likes}
                    </button>
                    <button class="comment-action reply-comment">
                        <i class="fas fa-reply"></i> Reply
                    </button>
                    <button class="comment-action report-comment" data-comment-id="${comment.id}">
                        <i class="fas fa-flag"></i> Report
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
 * Get time ago string
 */
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Get sentiment icon
 */
function getSentimentIcon(sentiment) {
    if (!sentiment) return '';
    
    if (sentiment > 0.7) {
        return '<span class="sentiment-icon positive" title="Positive sentiment"><i class="fas fa-smile"></i></span>';
    } else if (sentiment < 0.3) {
        return '<span class="sentiment-icon negative" title="Negative sentiment"><i class="fas fa-frown"></i></span>';
    } else {
        return '<span class="sentiment-icon neutral" title="Neutral sentiment"><i class="fas fa-meh"></i></span>';
    }
}

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
window.commentsState = commentsState;
window.clearReplyState = clearReplyState;