/**
 * Socket.io Event Handlers
 * Handles real-time communication for comments, notifications, and live features
 */

const aiService = require('../services/aiService');
const commentService = require('../services/commentService');
const notificationService = require('../services/notificationService');

// Store connected users
const connectedUsers = new Map();

/**
 * Initialize socket handlers
 */
function initializeHandlers(socket, io) {
    // User connection
    socket.on('user_connected', (userData) => {
        handleUserConnection(socket, userData);
    });

    // Blog post events
    socket.on('join_post', (postId) => {
        handleJoinPost(socket, postId);
    });

    socket.on('leave_post', (postId) => {
        handleLeavePost(socket, postId);
    });

    // Comment events
    socket.on('new_comment', (commentData) => {
        handleNewComment(socket, io, commentData);
    });

    socket.on('comment_like', (likeData) => {
        handleCommentLike(socket, io, likeData);
    });

    socket.on('comment_reply', (replyData) => {
        handleCommentReply(socket, io, replyData);
    });

    socket.on('comment_report', (reportData) => {
        handleCommentReport(socket, io, reportData);
    });

    // AI search events
    socket.on('ai_search', (searchData) => {
        handleAISearch(socket, searchData);
    });

    // Real-time notifications
    socket.on('subscribe_notifications', (userId) => {
        handleNotificationSubscription(socket, userId);
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
        handleTypingStart(socket, data);
    });

    socket.on('typing_stop', (data) => {
        handleTypingStop(socket, data);
    });

    // Reading progress
    socket.on('reading_progress', (progressData) => {
        handleReadingProgress(socket, progressData);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
        handleUserDisconnect(socket);
    });
}

/**
 * Handle user connection
 */
function handleUserConnection(socket, userData) {
    if (userData && userData.userId) {
        connectedUsers.set(socket.id, {
            userId: userData.userId,
            username: userData.username,
            avatar: userData.avatar,
            connectedAt: new Date()
        });

        socket.userId = userData.userId;
        socket.username = userData.username;

        console.log(`User ${userData.username} connected: ${socket.id}`);
    }
}

/**
 * Handle joining a blog post room
 */
function handleJoinPost(socket, postId) {
    socket.join(`post_${postId}`);
    
    // Notify others in the room
    socket.to(`post_${postId}`).emit('user_joined_post', {
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date()
    });

    console.log(`User ${socket.username || socket.id} joined post ${postId}`);
}

/**
 * Handle leaving a blog post room
 */
function handleLeavePost(socket, postId) {
    socket.leave(`post_${postId}`);
    
    // Notify others in the room
    socket.to(`post_${postId}`).emit('user_left_post', {
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date()
    });

    console.log(`User ${socket.username || socket.id} left post ${postId}`);
}

/**
 * Handle new comment
 */
async function handleNewComment(socket, io, commentData) {
    try {
        // AI moderation check
        const moderationResult = await aiService.moderateContent(commentData.content);
        
        // Create comment object
        const comment = {
            ...commentData,
            id: Date.now(),
            userId: socket.userId,
            username: socket.username,
            timestamp: new Date(),
            sentiment: moderationResult.sentiment,
            toxicity: moderationResult.toxicity,
            isModerated: moderationResult.toxicity < 0.3,
            likes: 0,
            replies: []
        };

        // Save to database (mock)
        // await commentService.createComment(comment);

        // Emit to all users in the post room
        io.to(`post_${commentData.postId}`).emit('comment_added', comment);

        // Send notification to post author
        // await notificationService.notifyPostAuthor(commentData.postId, comment);

        console.log(`New comment from ${socket.username} on post ${commentData.postId}`);

    } catch (error) {
        console.error('Error handling new comment:', error);
        socket.emit('comment_error', {
            message: 'Failed to post comment',
            error: error.message
        });
    }
}

/**
 * Handle comment like
 */
function handleCommentLike(socket, io, likeData) {
    // Emit to all users in the post room
    io.to(`post_${likeData.postId}`).emit('comment_liked', {
        commentId: likeData.commentId,
        userId: socket.userId,
        action: likeData.action,
        timestamp: new Date()
    });

    console.log(`Comment ${likeData.commentId} ${likeData.action}d by ${socket.username}`);
}

/**
 * Handle comment reply
 */
async function handleCommentReply(socket, io, replyData) {
    try {
        // AI moderation check
        const moderationResult = await aiService.moderateContent(replyData.content);
        
        const reply = {
            ...replyData,
            id: Date.now(),
            userId: socket.userId,
            username: socket.username,
            timestamp: new Date(),
            sentiment: moderationResult.sentiment,
            isModerated: moderationResult.toxicity < 0.3,
            likes: 0
        };

        // Emit to all users in the post room
        io.to(`post_${replyData.postId}`).emit('comment_reply_added', reply);

        console.log(`Reply from ${socket.username} to comment ${replyData.parentCommentId}`);

    } catch (error) {
        console.error('Error handling comment reply:', error);
        socket.emit('comment_error', {
            message: 'Failed to post reply',
            error: error.message
        });
    }
}

/**
 * Handle comment report
 */
function handleCommentReport(socket, io, reportData) {
    // Log report for moderation review
    console.log(`Comment ${reportData.commentId} reported by ${socket.username} for: ${reportData.reason}`);
    
    // Notify moderators
    io.emit('moderation_alert', {
        type: 'comment_reported',
        commentId: reportData.commentId,
        reason: reportData.reason,
        reportedBy: socket.username,
        timestamp: new Date()
    });

    // Acknowledge to reporter
    socket.emit('report_acknowledged', {
        message: 'Thank you for your report. Our moderation team will review it.'
    });
}

/**
 * Handle AI search
 */
async function handleAISearch(socket, searchData) {
    try {
        console.log(`AI search request from ${socket.username}: "${searchData.query}"`);
        
        // Perform AI-enhanced search
        const searchResults = await aiService.performSemanticSearch(searchData.query, searchData.filters);
        
        // Send results back to user
        socket.emit('search_results', {
            query: searchData.query,
            results: searchResults,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('Error performing AI search:', error);
        socket.emit('search_error', {
            message: 'Search failed',
            error: error.message
        });
    }
}

/**
 * Handle notification subscription
 */
function handleNotificationSubscription(socket, userId) {
    socket.join(`notifications_${userId}`);
    console.log(`User ${socket.username} subscribed to notifications`);
}

/**
 * Handle typing indicators
 */
function handleTypingStart(socket, data) {
    socket.to(`post_${data.postId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: true,
        timestamp: new Date()
    });
}

function handleTypingStop(socket, data) {
    socket.to(`post_${data.postId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: false,
        timestamp: new Date()
    });
}

/**
 * Handle reading progress
 */
function handleReadingProgress(socket, progressData) {
    // Emit reading progress for real-time analytics
    socket.to(`post_${progressData.postId}`).emit('reading_progress_update', {
        userId: socket.userId,
        progress: progressData.progress,
        timestamp: new Date()
    });
}

/**
 * Handle user disconnect
 */
function handleUserDisconnect(socket) {
    const userData = connectedUsers.get(socket.id);
    
    if (userData) {
        console.log(`User ${userData.username} disconnected: ${socket.id}`);
        connectedUsers.delete(socket.id);
    }
}

/**
 * Broadcast notification to specific user
 */
function broadcastNotification(io, userId, notification) {
    io.to(`notifications_${userId}`).emit('new_notification', notification);
}

/**
 * Broadcast system announcement
 */
function broadcastSystemAnnouncement(io, announcement) {
    io.emit('system_announcement', {
        ...announcement,
        timestamp: new Date()
    });
}

/**
 * Get connected users count
 */
function getConnectedUsersCount() {
    return connectedUsers.size;
}

/**
 * Get users in post room
 */
function getUsersInPost(io, postId) {
    const room = io.sockets.adapter.rooms.get(`post_${postId}`);
    return room ? room.size : 0;
}

module.exports = {
    initializeHandlers,
    broadcastNotification,
    broadcastSystemAnnouncement,
    getConnectedUsersCount,
    getUsersInPost
};