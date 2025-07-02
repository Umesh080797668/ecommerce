-- Blog Platform Database Schema Extension
-- Extends the existing e-commerce database for blog functionality

-- Blog Categories
CREATE TABLE blog_categories (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#4a6cf7',
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog Tags
CREATE TABLE blog_tags (
    tag_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#718096',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts
CREATE TABLE blog_posts (
    post_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id BIGINT NOT NULL,
    category_id BIGINT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(255),
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    og_image VARCHAR(255),
    status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    reading_time INT DEFAULT 0,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    scheduled_at DATETIME NULL,
    published_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES blog_categories(category_id) ON DELETE SET NULL,
    INDEX idx_status_published (status, published_at),
    INDEX idx_author (author_id),
    INDEX idx_category (category_id),
    FULLTEXT(title, content, excerpt)
);

-- Blog Post Tags (Many-to-Many)
CREATE TABLE blog_post_tags (
    post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES blog_tags(tag_id) ON DELETE CASCADE
);

-- Blog Comments
CREATE TABLE blog_comments (
    comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    parent_id BIGINT NULL,
    user_id BIGINT NULL,
    author_name VARCHAR(100),
    author_email VARCHAR(255),
    author_website VARCHAR(255),
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam', 'trash') DEFAULT 'pending',
    sentiment_score DECIMAL(3,2) DEFAULT 0.00,
    is_ai_detected BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES blog_comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_post_status (post_id, status),
    INDEX idx_parent (parent_id)
);

-- Comment Reactions
CREATE TABLE comment_reactions (
    reaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    comment_id BIGINT NOT NULL,
    user_id BIGINT NULL,
    user_ip VARCHAR(45),
    reaction_type ENUM('like', 'dislike', 'heart', 'laugh', 'angry') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES blog_comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_reaction (comment_id, user_id, reaction_type),
    UNIQUE KEY unique_ip_reaction (comment_id, user_ip, reaction_type)
);

-- Blog Bookmarks
CREATE TABLE blog_bookmarks (
    bookmark_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post (user_id, post_id)
);

-- Blog Subscribers
CREATE TABLE blog_subscribers (
    subscriber_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    subscription_token VARCHAR(255) UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL
);

-- User Followers (for social features)
CREATE TABLE user_followers (
    follower_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    follower_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (follower_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (user_id, follower_user_id)
);

-- Blog Analytics
CREATE TABLE blog_analytics (
    analytics_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT,
    event_type ENUM('view', 'like', 'share', 'comment', 'bookmark') NOT NULL,
    user_id BIGINT NULL,
    user_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    country VARCHAR(2),
    device_type ENUM('desktop', 'tablet', 'mobile') DEFAULT 'desktop',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_post_event (post_id, event_type),
    INDEX idx_date (created_at)
);

-- AI Content Analysis
CREATE TABLE ai_content_analysis (
    analysis_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    readability_score DECIMAL(3,2),
    sentiment_score DECIMAL(3,2),
    keyword_density JSON,
    suggested_tags JSON,
    seo_score DECIMAL(3,2),
    content_quality_score DECIMAL(3,2),
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color, icon) VALUES
('Technology', 'technology', 'Latest tech trends and innovations', '#4a6cf7', 'fas fa-microchip'),
('Lifestyle', 'lifestyle', 'Tips for better living', '#10b981', 'fas fa-leaf'),
('Business', 'business', 'Business insights and strategies', '#f59e0b', 'fas fa-briefcase'),
('Design', 'design', 'UI/UX and design inspiration', '#ec4899', 'fas fa-palette'),
('Programming', 'programming', 'Code tutorials and best practices', '#8b5cf6', 'fas fa-code');

-- Insert default tags
INSERT INTO blog_tags (name, slug, color) VALUES
('AI', 'ai', '#4a6cf7'),
('Machine Learning', 'machine-learning', '#10b981'),
('Web Development', 'web-development', '#f59e0b'),
('React', 'react', '#06b6d4'),
('Node.js', 'nodejs', '#84cc16'),
('JavaScript', 'javascript', '#eab308'),
('CSS', 'css', '#3b82f6'),
('HTML', 'html', '#ef4444'),
('Tutorial', 'tutorial', '#8b5cf6'),
('Tips', 'tips', '#ec4899');