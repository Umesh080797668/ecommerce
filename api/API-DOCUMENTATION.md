/**
 * ShopVerse Enterprise API Documentation
 * RESTful API with GraphQL support for enterprise features
 * @version 3.0.0
 */

# ShopVerse Enterprise API v3.0

## Base URL
`https://api.shopverse.com/v3`

## Authentication
All API requests require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Rate Limiting
- 1000 requests per 15 minutes for authenticated users
- 100 requests per 15 minutes for unauthenticated users
- Enterprise customers have higher limits based on their plan

---

## 🚀 Enterprise Features Endpoints

### Analytics & Business Intelligence

#### Get Advanced Analytics
```http
GET /analytics/dashboard
```
**Response:**
```json
{
  "overview": {
    "totalUsers": 125847,
    "premiumSubscribers": 8934,
    "monthlyRevenue": 847293,
    "conversionRate": 3.2
  },
  "funnels": {...},
  "cohorts": {...},
  "realTimeEvents": [...]
}
```

#### Track Custom Event
```http
POST /analytics/events
```
**Body:**
```json
{
  "eventName": "product_view",
  "properties": {
    "productId": "123",
    "category": "electronics",
    "price": 299.99
  }
}
```

#### Get Funnel Analysis
```http
GET /analytics/funnels/{funnelId}
```

#### Get Cohort Analysis
```http
GET /analytics/cohorts?timeframe=30d
```

---

### Subscription Management

#### Get Current Subscription
```http
GET /subscriptions/current
```

#### Create Subscription
```http
POST /subscriptions/create
```
**Body:**
```json
{
  "priceId": "price_pro_monthly",
  "paymentMethodId": "pm_1234567890",
  "trialDays": 14
}
```

#### Update Subscription
```http
PUT /subscriptions/{subscriptionId}
```

#### Cancel Subscription
```http
DELETE /subscriptions/{subscriptionId}
```

#### Apply Promo Code
```http
POST /subscriptions/promo-code
```
**Body:**
```json
{
  "subscriptionId": "sub_1234567890",
  "promoCode": "SAVE20"
}
```

---

### AI & Machine Learning

#### Get Personalized Recommendations
```http
POST /ai/recommendations
```
**Body:**
```json
{
  "userId": "user123",
  "count": 10,
  "categories": ["electronics", "clothing"],
  "excludeViewed": true
}
```

#### Analyze Sentiment
```http
POST /ai/sentiment
```
**Body:**
```json
{
  "text": "This product is amazing! Love it.",
  "context": "product_review"
}
```

#### Get User Behavior Profile
```http
GET /ai/profile/{userId}
```

#### Update User Preferences
```http
PUT /ai/profile/{userId}/preferences
```

---

### Community Platform

#### Forum Categories
```http
GET /forums/categories
POST /forums/categories
```

#### Forum Threads
```http
GET /forums/threads?categoryId=1&page=1&limit=20
POST /forums/threads
PUT /forums/threads/{threadId}
DELETE /forums/threads/{threadId}
```

#### Forum Posts
```http
GET /forums/threads/{threadId}/posts
POST /forums/posts
PUT /forums/posts/{postId}
DELETE /forums/posts/{postId}
```

#### Vote on Posts
```http
POST /forums/posts/{postId}/vote
```
**Body:**
```json
{
  "voteType": "upvote"
}
```

#### Search Forums
```http
GET /forums/search?q=query&category=1&sort=relevance
```

---

### Gamification

#### Award Points
```http
POST /gamification/points
```
**Body:**
```json
{
  "action": "purchase",
  "points": 50,
  "referenceId": "order_123"
}
```

#### Check Badges
```http
GET /gamification/badges/check
```

#### Get Leaderboard
```http
GET /gamification/leaderboard?timeframe=weekly&limit=50
```

#### Get User Achievements
```http
GET /gamification/achievements/{userId}
```

---

### Messaging System

#### Get Conversations
```http
GET /messaging/conversations
```

#### Start Conversation
```http
POST /messaging/conversations
```
**Body:**
```json
{
  "participants": ["user1", "user2"],
  "initialMessage": "Hello!"
}
```

#### Send Message
```http
POST /messaging/messages
```
**Body (multipart/form-data):**
```
conversationId: "conv_123"
content: "Message text"
attachment_0: (file)
```

#### Mark Messages as Read
```http
POST /messaging/messages/read
```

---

### Content Management

#### Get Content Items
```http
GET /content/items?type=blog_post&status=published&page=1
```

#### Create Content
```http
POST /content/items
```

#### Content Workflows
```http
GET /content/workflows
POST /content/workflows/{workflowId}/advance
```

#### Content Series
```http
GET /content/series
POST /content/series
GET /content/series/{seriesId}/progress
```

---

### Events Management

#### Get Upcoming Events
```http
GET /events/upcoming
```

#### Create Event
```http
POST /events
```
**Body:**
```json
{
  "title": "Product Launch Webinar",
  "description": "Join us for the launch of our new product line",
  "eventType": "webinar",
  "startDate": "2025-01-15T15:00:00Z",
  "endDate": "2025-01-15T16:00:00Z",
  "maxAttendees": 500
}
```

#### Register for Event
```http
POST /events/{eventId}/register
```

---

## 📊 GraphQL API

### Endpoint
`https://api.shopverse.com/v3/graphql`

### Example Queries

#### Get User with Subscription and Analytics
```graphql
query GetUserDashboard($userId: ID!) {
  user(id: $userId) {
    id
    email
    subscription {
      plan {
        name
        features
      }
      status
      currentPeriodEnd
    }
    analytics {
      totalEvents
      lastActivity
      topCategories
    }
    gamification {
      totalPoints
      level
      badges {
        name
        earnedAt
      }
    }
  }
}
```

#### Get Personalized Product Feed
```graphql
query GetPersonalizedFeed($userId: ID!, $limit: Int = 20) {
  personalizedFeed(userId: $userId, limit: $limit) {
    products {
      id
      name
      price
      image
      recommendationReason
      aiScore
    }
    algorithms
    generatedAt
  }
}
```

#### Get Community Activity
```graphql
query GetCommunityActivity($limit: Int = 10) {
  recentForumPosts(limit: $limit) {
    id
    content
    author {
      name
      avatar
      badges
    }
    thread {
      title
      category {
        name
      }
    }
    createdAt
  }
  
  upcomingEvents(limit: 5) {
    id
    title
    startDate
    attendeeCount
  }
}
```

---

## 🔐 Webhooks

### Stripe Webhooks
```http
POST /webhooks/stripe
```
Handles subscription events, payment confirmations, and invoice updates.

### Analytics Webhooks
```http
POST /webhooks/analytics
```
Real-time event processing for immediate insights.

---

## 📱 Mobile API Considerations

### Offline Support
- GET endpoints support `If-Modified-Since` headers for caching
- POST endpoints return `409 Conflict` for duplicate submissions
- Background sync queues available via `/sync` endpoints

### Push Notifications
```http
POST /notifications/push
```
**Body:**
```json
{
  "userIds": ["user1", "user2"],
  "title": "New Product Launch",
  "body": "Check out our latest products!",
  "data": {
    "screen": "ProductDetail",
    "productId": "123"
  }
}
```

---

## 🔧 Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2025-01-01T12:00:00Z",
    "requestId": "req_123456789"
  }
}
```

### HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## 🔒 Security Features

### Request Signing
Enterprise customers can enable request signing for additional security:
```http
X-ShopVerse-Signature: sha256=signature_here
```

### IP Whitelisting
Configure allowed IP addresses in your enterprise dashboard.

### Audit Logs
All API calls are logged and available via:
```http
GET /audit/logs?startDate=2025-01-01&endDate=2025-01-31
```

---

## 📈 Usage Analytics

### API Metrics Dashboard
Access detailed API usage metrics:
```http
GET /metrics/api-usage?timeframe=7d
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1672531200
```

---

## 🛠 SDKs and Libraries

### Official SDKs
- JavaScript/TypeScript SDK
- Python SDK
- PHP SDK
- React Native SDK
- iOS Swift SDK
- Android Kotlin SDK

### Installation
```bash
npm install @shopverse/enterprise-sdk
pip install shopverse-enterprise-sdk
composer require shopverse/enterprise-sdk
```

---

## 🔄 API Versioning

### Current Version: v3.0
- Backwards compatible with v2.x for 12 months
- New features added to v3.0 only
- Deprecation notices provided 6 months in advance

### Version Header
```http
Accept: application/vnd.shopverse.v3+json
```

---

## 📞 Support

- **Documentation**: https://docs.shopverse.com/api
- **Support Portal**: https://support.shopverse.com
- **Developer Community**: https://community.shopverse.com/developers
- **Status Page**: https://status.shopverse.com

### Enterprise Support
Enterprise customers have access to:
- Dedicated support engineer
- SLA guarantees (99.9% uptime)
- Priority bug fixes
- Custom integration assistance