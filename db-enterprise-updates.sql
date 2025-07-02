-- ShopVerse Enterprise Database Schema Updates
-- Adding tables and fields for Phase 3 enterprise features
-- Version 3.0.0

-- ============================================================================
-- SUBSCRIPTION & MONETIZATION TABLES
-- ============================================================================

-- Subscription plans
CREATE TABLE subscription_plans (
    plan_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stripe_price_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    features JSON,
    is_active BOOLEAN DEFAULT TRUE,
    trial_days INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    subscription_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    stripe_subscription_id VARCHAR(100) UNIQUE,
    status ENUM('trialing', 'active', 'past_due', 'canceled', 'unpaid') NOT NULL,
    current_period_start DATETIME,
    current_period_end DATETIME,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at DATETIME,
    trial_start DATETIME,
    trial_end DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id) ON DELETE RESTRICT
);

-- Payment methods
CREATE TABLE payment_methods (
    payment_method_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    stripe_payment_method_id VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    card_brand VARCHAR(50),
    card_last4 VARCHAR(4),
    card_exp_month INT,
    card_exp_year INT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Promo codes
CREATE TABLE promo_codes (
    promo_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('percentage', 'fixed_amount', 'free_trial') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    max_uses INT,
    uses_count INT DEFAULT 0,
    valid_from DATETIME,
    valid_until DATETIME,
    applicable_plans JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- ============================================================================
-- ANALYTICS & BUSINESS INTELLIGENCE TABLES
-- ============================================================================

-- Enhanced analytics events
CREATE TABLE analytics_events (
    event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    session_id VARCHAR(100),
    event_name VARCHAR(100) NOT NULL,
    event_properties JSON,
    page_url VARCHAR(500),
    referrer_url VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_event_name (event_name),
    INDEX idx_timestamp (timestamp),
    INDEX idx_user_session (user_id, session_id)
);

-- Conversion funnels
CREATE TABLE conversion_funnels (
    funnel_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    steps JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Funnel conversions
CREATE TABLE funnel_conversions (
    conversion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    funnel_id BIGINT NOT NULL,
    user_id BIGINT,
    session_id VARCHAR(100),
    step_name VARCHAR(100) NOT NULL,
    timestamp DATETIME NOT NULL,
    properties JSON,
    FOREIGN KEY (funnel_id) REFERENCES conversion_funnels(funnel_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_funnel_step (funnel_id, step_name),
    INDEX idx_timestamp (timestamp)
);

-- User cohorts
CREATE TABLE user_cohorts (
    cohort_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    criteria JSON NOT NULL,
    period_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cohort users
CREATE TABLE cohort_users (
    cohort_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at DATE NOT NULL,
    PRIMARY KEY (cohort_id, user_id),
    FOREIGN KEY (cohort_id) REFERENCES user_cohorts(cohort_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- A/B testing
CREATE TABLE ab_tests (
    test_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    variants JSON NOT NULL,
    traffic_allocation DECIMAL(3,2) DEFAULT 1.00,
    status ENUM('draft', 'running', 'paused', 'completed') DEFAULT 'draft',
    start_date DATETIME,
    end_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- A/B test assignments
CREATE TABLE ab_test_assignments (
    assignment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    test_id BIGINT NOT NULL,
    user_id BIGINT,
    session_id VARCHAR(100),
    variant VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES ab_tests(test_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_test_variant (test_id, variant)
);

-- ============================================================================
-- AI & MACHINE LEARNING TABLES
-- ============================================================================

-- User behavior profiles
CREATE TABLE user_behavior_profiles (
    profile_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    category_preferences JSON,
    brand_preferences JSON,
    price_range_preferences JSON,
    color_preferences JSON,
    size_preferences JSON,
    seasonal_patterns JSON,
    time_preferences JSON,
    device_preferences JSON,
    interaction_score DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Product recommendations
CREATE TABLE product_recommendations (
    recommendation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    score DECIMAL(5,4) NOT NULL,
    reasons JSON,
    shown_at TIMESTAMP,
    clicked_at TIMESTAMP,
    purchased_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    INDEX idx_user_score (user_id, score DESC),
    INDEX idx_created_at (created_at)
);

-- Content sentiment analysis
CREATE TABLE content_sentiment (
    sentiment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content_type ENUM('review', 'comment', 'message', 'post') NOT NULL,
    content_id BIGINT NOT NULL,
    sentiment_score DECIMAL(3,2) NOT NULL, -- -1 to 1
    sentiment_label ENUM('positive', 'negative', 'neutral') NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    analysis_model VARCHAR(50) NOT NULL,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_content (content_type, content_id),
    INDEX idx_sentiment (sentiment_label, sentiment_score)
);

-- ============================================================================
-- COMMUNITY & SOCIAL FEATURES TABLES
-- ============================================================================

-- Forum categories
CREATE TABLE forum_categories (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    parent_id BIGINT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES forum_categories(category_id) ON DELETE SET NULL
);

-- Forum threads
CREATE TABLE forum_threads (
    thread_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    replies_count INT DEFAULT 0,
    last_reply_at TIMESTAMP,
    last_reply_user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES forum_categories(category_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (last_reply_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_category_updated (category_id, updated_at DESC)
);

-- Forum posts
CREATE TABLE forum_posts (
    post_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    thread_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_post_id BIGINT,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    upvotes_count INT DEFAULT 0,
    downvotes_count INT DEFAULT 0,
    status ENUM('published', 'pending_moderation', 'hidden', 'deleted') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES forum_threads(thread_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_post_id) REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    INDEX idx_thread_created (thread_id, created_at)
);

-- Post votes
CREATE TABLE post_votes (
    vote_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    vote_type ENUM('upvote', 'downvote') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_post_vote (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Gamification points
CREATE TABLE user_points (
    point_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    points INT NOT NULL,
    description TEXT,
    reference_id BIGINT,
    reference_type VARCHAR(50),
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_awarded (user_id, awarded_at DESC)
);

-- User badges
CREATE TABLE user_badges (
    badge_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    badge_type VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_icon VARCHAR(255),
    criteria_met JSON,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_earned (user_id, earned_at DESC)
);

-- Events
CREATE TABLE events (
    event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organizer_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type ENUM('webinar', 'workshop', 'sale', 'launch', 'meetup') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    location VARCHAR(255),
    max_attendees INT,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Event registrations
CREATE TABLE event_registrations (
    registration_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status ENUM('registered', 'attended', 'no_show', 'cancelled') DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_event_user (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- CONTENT MANAGEMENT & WORKFLOW TABLES
-- ============================================================================

-- Content workflows
CREATE TABLE content_workflows (
    workflow_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    steps JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content items
CREATE TABLE content_items (
    content_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    workflow_id BIGINT,
    author_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    content_type ENUM('blog_post', 'tutorial', 'video', 'podcast', 'course') NOT NULL,
    status ENUM('draft', 'in_review', 'approved', 'published', 'archived') DEFAULT 'draft',
    current_step VARCHAR(100),
    metadata JSON,
    scheduled_publish_at DATETIME,
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES content_workflows(workflow_id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Content series
CREATE TABLE content_series (
    series_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author_id BIGINT NOT NULL,
    is_course BOOLEAN DEFAULT FALSE,
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    completion_certificate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Series content mapping
CREATE TABLE series_content (
    series_id BIGINT NOT NULL,
    content_id BIGINT NOT NULL,
    sequence_order INT NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (series_id, content_id),
    FOREIGN KEY (series_id) REFERENCES content_series(series_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content_items(content_id) ON DELETE CASCADE
);

-- User progress tracking
CREATE TABLE user_content_progress (
    progress_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    content_id BIGINT,
    series_id BIGINT,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    completed_at DATETIME,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content_items(content_id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES content_series(series_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_content (user_id, content_id),
    UNIQUE KEY unique_user_series (user_id, series_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Subscription indexes
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status, current_period_end);
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id, status);

-- Analytics indexes
CREATE INDEX idx_analytics_events_user_time ON analytics_events(user_id, timestamp);
CREATE INDEX idx_analytics_events_event_time ON analytics_events(event_name, timestamp);

-- AI/ML indexes
CREATE INDEX idx_recommendations_user_expires ON product_recommendations(user_id, expires_at);
CREATE INDEX idx_recommendations_score ON product_recommendations(score DESC, created_at DESC);

-- Community indexes
CREATE INDEX idx_forum_threads_category_updated ON forum_threads(category_id, updated_at DESC);
CREATE INDEX idx_forum_posts_thread_created ON forum_posts(thread_id, created_at);
CREATE INDEX idx_user_points_total ON user_points(user_id, points);

-- Content indexes
CREATE INDEX idx_content_items_status_published ON content_items(status, published_at);
CREATE INDEX idx_content_items_author ON content_items(author_id, status);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (stripe_price_id, name, description, price_monthly, price_yearly, features, trial_days) VALUES
('price_basic_monthly', 'Basic', 'Essential features for small businesses', 29.00, 290.00, '["Basic Analytics", "Standard Support", "10GB Storage"]', 14),
('price_pro_monthly', 'Pro', 'Advanced features for growing businesses', 79.00, 790.00, '["Advanced Analytics", "Priority Support", "100GB Storage", "AI Features", "Community Access"]', 14),
('price_enterprise_monthly', 'Enterprise', 'Full-featured solution for large enterprises', 199.00, 1990.00, '["Full Analytics Suite", "24/7 Support", "Unlimited Storage", "Custom AI Models", "White-label Options", "API Access"]', 14);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, icon, color, display_order) VALUES
('General Discussion', 'General topics and discussions', 'fas fa-comments', '#3498db', 1),
('Product Reviews', 'Share your product experiences', 'fas fa-star', '#f39c12', 2),
('Technical Support', 'Get help with technical issues', 'fas fa-tools', '#e74c3c', 3),
('Feature Requests', 'Suggest new features and improvements', 'fas fa-lightbulb', '#9b59b6', 4),
('Community Events', 'Announcements and event discussions', 'fas fa-calendar', '#1abc9c', 5);

-- Insert default conversion funnel
INSERT INTO conversion_funnels (name, description, steps) VALUES
('E-commerce Purchase Funnel', 'Track user journey from product view to purchase', '["product_view", "add_to_cart", "checkout_start", "payment_info", "purchase"]');

-- Insert default content workflow
INSERT INTO content_workflows (name, description, steps) VALUES
('Standard Content Review', 'Standard editorial workflow for content approval', '["draft", "editorial_review", "fact_check", "final_approval", "published"]');

-- ============================================================================
-- PERFORMANCE OPTIMIZATIONS
-- ============================================================================

-- Optimize frequently queried tables
OPTIMIZE TABLE analytics_events;
OPTIMIZE TABLE product_recommendations;
OPTIMIZE TABLE user_subscriptions;
OPTIMIZE TABLE forum_posts;

-- Update table statistics
ANALYZE TABLE analytics_events;
ANALYZE TABLE product_recommendations;
ANALYZE TABLE user_subscriptions;
ANALYZE TABLE forum_posts;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active subscriptions view
CREATE VIEW v_active_subscriptions AS
SELECT 
    us.*,
    sp.name as plan_name,
    sp.features,
    u.email,
    u.first_name,
    u.last_name
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.plan_id
JOIN users u ON us.user_id = u.user_id
WHERE us.status IN ('active', 'trialing');

-- User analytics summary view
CREATE VIEW v_user_analytics_summary AS
SELECT 
    u.user_id,
    u.email,
    COUNT(ae.event_id) as total_events,
    COUNT(DISTINCT DATE(ae.timestamp)) as active_days,
    MAX(ae.timestamp) as last_activity,
    AVG(CASE WHEN ae.event_name = 'page_view' THEN 1 ELSE 0 END) as avg_page_views
FROM users u
LEFT JOIN analytics_events ae ON u.user_id = ae.user_id
WHERE u.is_active = TRUE
GROUP BY u.user_id, u.email;

-- Top forum contributors view
CREATE VIEW v_top_forum_contributors AS
SELECT 
    u.user_id,
    u.first_name,
    u.last_name,
    COUNT(fp.post_id) as total_posts,
    SUM(fp.upvotes_count) as total_upvotes,
    AVG(fp.upvotes_count) as avg_upvotes_per_post
FROM users u
JOIN forum_posts fp ON u.user_id = fp.user_id
WHERE fp.status = 'published'
GROUP BY u.user_id, u.first_name, u.last_name
ORDER BY total_upvotes DESC, total_posts DESC;

COMMIT;