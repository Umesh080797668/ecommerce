/**
 * ShopVerse Community Platform
 * Forums, gamification, and social features
 * @version 3.0.0
 */

class CommunityPlatform {
    constructor() {
        this.config = window.shopVerseConfig?.social || {};
        this.gamification = null;
        this.forums = null;
        this.messaging = null;
        this.events = null;
        this.socket = null;
        
        this.init();
    }

    /**
     * Initialize community platform
     */
    async init() {
        try {
            await this.initSocketConnection();
            this.initForums();
            this.initGamification();
            this.initMessaging();
            this.initEvents();
            this.setupEventListeners();
            
            console.log('✅ Community Platform initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Community Platform:', error);
        }
    }

    /**
     * Initialize Socket.IO connection for real-time features
     */
    async initSocketConnection() {
        if (!this.config.messaging?.realTime) return;

        try {
            // Load Socket.IO
            if (typeof io === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
                document.head.appendChild(script);

                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });
            }

            this.socket = io('/', {
                auth: {
                    token: this.getAuthToken()
                }
            });

            this.socket.on('connect', () => {
                console.log('✅ Real-time connection established');
            });

            this.socket.on('disconnect', () => {
                console.log('⚠️ Real-time connection lost');
            });

        } catch (error) {
            console.error('Error initializing socket connection:', error);
        }
    }

    /**
     * Initialize Forums System
     */
    initForums() {
        this.forums = {
            categories: new Map(),
            threads: new Map(),
            posts: new Map(),
            moderationQueue: [],

            /**
             * Create new forum category
             */
            createCategory: async (categoryData) => {
                try {
                    const response = await fetch('/api/forums/categories', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify(categoryData)
                    });

                    const category = await response.json();
                    this.forums.categories.set(category.id, category);
                    
                    window.enterpriseAnalytics?.trackEvent('forum_category_created', {
                        category_id: category.id,
                        category_name: category.name
                    });

                    return category;
                } catch (error) {
                    console.error('Error creating forum category:', error);
                    throw error;
                }
            },

            /**
             * Create new thread
             */
            createThread: async (threadData) => {
                try {
                    const response = await fetch('/api/forums/threads', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify(threadData)
                    });

                    const thread = await response.json();
                    this.forums.threads.set(thread.id, thread);

                    // Award points for creating thread
                    this.gamification.awardPoints('thread_creation', 10);

                    // Real-time notification
                    if (this.socket) {
                        this.socket.emit('thread_created', thread);
                    }

                    window.enterpriseAnalytics?.trackEvent('forum_thread_created', {
                        thread_id: thread.id,
                        category_id: thread.category_id
                    });

                    return thread;
                } catch (error) {
                    console.error('Error creating thread:', error);
                    throw error;
                }
            },

            /**
             * Create new post
             */
            createPost: async (postData) => {
                try {
                    // Auto-moderation check
                    if (this.config.forums?.autoModeration) {
                        const moderationResult = await this.moderateContent(postData.content);
                        if (!moderationResult.approved) {
                            postData.status = 'pending_moderation';
                            this.forums.moderationQueue.push(postData);
                        }
                    }

                    const response = await fetch('/api/forums/posts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify(postData)
                    });

                    const post = await response.json();
                    this.forums.posts.set(post.id, post);

                    // Award points for posting
                    this.gamification.awardPoints('post_creation', 5);

                    // Real-time notification
                    if (this.socket) {
                        this.socket.emit('post_created', post);
                    }

                    window.enterpriseAnalytics?.trackEvent('forum_post_created', {
                        post_id: post.id,
                        thread_id: post.thread_id
                    });

                    return post;
                } catch (error) {
                    console.error('Error creating post:', error);
                    throw error;
                }
            },

            /**
             * Vote on post
             */
            votePost: async (postId, voteType) => {
                try {
                    const response = await fetch(`/api/forums/posts/${postId}/vote`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify({ vote_type: voteType })
                    });

                    const result = await response.json();

                    // Award points for voting
                    this.gamification.awardPoints('vote', 1);

                    window.enterpriseAnalytics?.trackEvent('forum_post_voted', {
                        post_id: postId,
                        vote_type: voteType
                    });

                    return result;
                } catch (error) {
                    console.error('Error voting on post:', error);
                    throw error;
                }
            },

            /**
             * Search forums
             */
            search: async (query, filters = {}) => {
                try {
                    const searchParams = new URLSearchParams({
                        q: query,
                        ...filters
                    });

                    const response = await fetch(`/api/forums/search?${searchParams}`, {
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        }
                    });

                    return await response.json();
                } catch (error) {
                    console.error('Error searching forums:', error);
                    throw error;
                }
            }
        };
    }

    /**
     * Initialize Gamification System
     */
    initGamification() {
        this.gamification = {
            userPoints: 0,
            userLevel: 1,
            badges: [],
            leaderboard: [],
            pointsConfig: this.config.gamification?.pointsSystem || {},
            badgesConfig: this.config.gamification?.badges || {},

            /**
             * Award points to user
             */
            awardPoints: async (action, points) => {
                try {
                    const response = await fetch('/api/gamification/points', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify({
                            action: action,
                            points: points
                        })
                    });

                    const result = await response.json();
                    this.gamification.userPoints = result.total_points;
                    this.gamification.userLevel = result.level;

                    // Check for new badges
                    await this.gamification.checkBadges();

                    // Show points notification
                    this.showPointsNotification(points, action);

                    window.enterpriseAnalytics?.trackEvent('points_awarded', {
                        action: action,
                        points: points,
                        total_points: result.total_points,
                        level: result.level
                    });

                    return result;
                } catch (error) {
                    console.error('Error awarding points:', error);
                }
            },

            /**
             * Check for new badges
             */
            checkBadges: async () => {
                try {
                    const response = await fetch('/api/gamification/badges/check', {
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        }
                    });

                    const newBadges = await response.json();

                    for (const badge of newBadges) {
                        this.gamification.badges.push(badge);
                        this.showBadgeNotification(badge);

                        window.enterpriseAnalytics?.trackEvent('badge_earned', {
                            badge_id: badge.id,
                            badge_name: badge.name
                        });
                    }
                } catch (error) {
                    console.error('Error checking badges:', error);
                }
            },

            /**
             * Get leaderboard
             */
            getLeaderboard: async (timeframe = 'all_time') => {
                try {
                    const response = await fetch(`/api/gamification/leaderboard?timeframe=${timeframe}`, {
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        }
                    });

                    this.gamification.leaderboard = await response.json();
                    return this.gamification.leaderboard;
                } catch (error) {
                    console.error('Error getting leaderboard:', error);
                    return [];
                }
            },

            /**
             * Get user achievements
             */
            getAchievements: async () => {
                try {
                    const response = await fetch('/api/gamification/achievements', {
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        }
                    });

                    return await response.json();
                } catch (error) {
                    console.error('Error getting achievements:', error);
                    return {};
                }
            }
        };
    }

    /**
     * Initialize Messaging System
     */
    initMessaging() {
        this.messaging = {
            conversations: new Map(),
            activeConversation: null,

            /**
             * Start new conversation
             */
            startConversation: async (participantIds, message) => {
                try {
                    const response = await fetch('/api/messaging/conversations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify({
                            participants: participantIds,
                            initial_message: message
                        })
                    });

                    const conversation = await response.json();
                    this.messaging.conversations.set(conversation.id, conversation);

                    // Real-time notification
                    if (this.socket) {
                        this.socket.emit('conversation_started', conversation);
                    }

                    return conversation;
                } catch (error) {
                    console.error('Error starting conversation:', error);
                    throw error;
                }
            },

            /**
             * Send message
             */
            sendMessage: async (conversationId, content, attachments = []) => {
                try {
                    const formData = new FormData();
                    formData.append('conversation_id', conversationId);
                    formData.append('content', content);

                    // Add attachments
                    attachments.forEach((file, index) => {
                        formData.append(`attachment_${index}`, file);
                    });

                    const response = await fetch('/api/messaging/messages', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: formData
                    });

                    const message = await response.json();

                    // Real-time message delivery
                    if (this.socket) {
                        this.socket.emit('message_sent', message);
                    }

                    window.enterpriseAnalytics?.trackEvent('message_sent', {
                        conversation_id: conversationId,
                        has_attachments: attachments.length > 0
                    });

                    return message;
                } catch (error) {
                    console.error('Error sending message:', error);
                    throw error;
                }
            },

            /**
             * Mark messages as read
             */
            markAsRead: async (conversationId, messageIds) => {
                try {
                    const response = await fetch('/api/messaging/messages/read', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify({
                            conversation_id: conversationId,
                            message_ids: messageIds
                        })
                    });

                    // Real-time read receipt
                    if (this.socket) {
                        this.socket.emit('messages_read', { conversationId, messageIds });
                    }

                    return await response.json();
                } catch (error) {
                    console.error('Error marking messages as read:', error);
                }
            },

            /**
             * Get conversations
             */
            getConversations: async () => {
                try {
                    const response = await fetch('/api/messaging/conversations', {
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        }
                    });

                    const conversations = await response.json();
                    conversations.forEach(conv => {
                        this.messaging.conversations.set(conv.id, conv);
                    });

                    return conversations;
                } catch (error) {
                    console.error('Error getting conversations:', error);
                    return [];
                }
            }
        };

        // Setup real-time message handlers
        if (this.socket) {
            this.socket.on('new_message', (message) => {
                this.handleNewMessage(message);
            });

            this.socket.on('message_read', (data) => {
                this.handleMessageRead(data);
            });
        }
    }

    /**
     * Initialize Events System
     */
    initEvents() {
        this.events = {
            upcomingEvents: [],
            registeredEvents: [],

            /**
             * Create event
             */
            createEvent: async (eventData) => {
                try {
                    const response = await fetch('/api/events', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        },
                        body: JSON.stringify(eventData)
                    });

                    const event = await response.json();

                    window.enterpriseAnalytics?.trackEvent('event_created', {
                        event_id: event.id,
                        event_type: event.type
                    });

                    return event;
                } catch (error) {
                    console.error('Error creating event:', error);
                    throw error;
                }
            },

            /**
             * Register for event
             */
            registerForEvent: async (eventId) => {
                try {
                    const response = await fetch(`/api/events/${eventId}/register`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        }
                    });

                    const result = await response.json();

                    // Award points for event registration
                    this.gamification.awardPoints('event_registration', 15);

                    window.enterpriseAnalytics?.trackEvent('event_registered', {
                        event_id: eventId
                    });

                    return result;
                } catch (error) {
                    console.error('Error registering for event:', error);
                    throw error;
                }
            },

            /**
             * Get upcoming events
             */
            getUpcomingEvents: async () => {
                try {
                    const response = await fetch('/api/events/upcoming', {
                        headers: {
                            'Authorization': `Bearer ${this.getAuthToken()}`
                        }
                    });

                    this.events.upcomingEvents = await response.json();
                    return this.events.upcomingEvents;
                } catch (error) {
                    console.error('Error getting upcoming events:', error);
                    return [];
                }
            }
        };
    }

    /**
     * Content moderation
     */
    async moderateContent(content) {
        try {
            // Check for spam and inappropriate content
            const response = await fetch('/api/moderation/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ content: content })
            });

            return await response.json();
        } catch (error) {
            console.error('Error moderating content:', error);
            return { approved: true }; // Default to approved if moderation fails
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Forum interactions
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-create-thread]')) {
                this.showCreateThreadModal();
            }

            if (event.target.matches('[data-reply-post]')) {
                const postId = event.target.getAttribute('data-post-id');
                this.showReplyModal(postId);
            }

            if (event.target.matches('[data-vote-post]')) {
                const postId = event.target.getAttribute('data-post-id');
                const voteType = event.target.getAttribute('data-vote-type');
                this.forums.votePost(postId, voteType);
            }

            if (event.target.matches('[data-start-message]')) {
                const userId = event.target.getAttribute('data-user-id');
                this.showMessageModal(userId);
            }
        });

        // Gamification notifications
        document.addEventListener('pointsAwarded', (event) => {
            this.updatePointsDisplay(event.detail);
        });

        document.addEventListener('badgeEarned', (event) => {
            this.updateBadgesDisplay(event.detail);
        });
    }

    /**
     * UI Helper methods
     */
    showCreateThreadModal() {
        const modalHTML = `
            <div class="modal-overlay" id="create-thread-modal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Create New Thread</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="create-thread-form">
                            <div class="form-group">
                                <label for="thread-title">Title</label>
                                <input type="text" id="thread-title" required>
                            </div>
                            <div class="form-group">
                                <label for="thread-category">Category</label>
                                <select id="thread-category" required></select>
                            </div>
                            <div class="form-group">
                                <label for="thread-content">Content</label>
                                <textarea id="thread-content" rows="6" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Create Thread</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.populateCategorySelect();
    }

    showPointsNotification(points, action) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.innerHTML = `
            <div class="points-notification-content">
                <i class="fas fa-star"></i>
                <span>+${points} points for ${action.replace('_', ' ')}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content">
                <i class="fas fa-trophy"></i>
                <span>New Badge Earned: ${badge.name}</span>
                <img src="${badge.icon}" alt="${badge.name}" class="badge-icon">
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    handleNewMessage(message) {
        // Update conversation in UI
        // Show notification if conversation is not active
        if (this.messaging.activeConversation !== message.conversation_id) {
            this.showMessageNotification(message);
        }
    }

    handleMessageRead(data) {
        // Update read status in UI
        // Remove unread indicators
    }

    populateCategorySelect() {
        // Populate category dropdown
    }

    getAuthToken() {
        return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
}

// Initialize Community Platform
window.communityPlatform = new CommunityPlatform();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CommunityPlatform;
}