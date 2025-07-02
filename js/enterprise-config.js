/**
 * ShopVerse Enterprise Configuration
 * Central configuration management for enterprise features
 * @version 3.0.0
 */

const enterpriseConfig = {
    // Core API Configuration
    api: {
        baseUrl: process.env.API_BASE_URL || 'https://api.shopverse.com/v3',
        timeout: 30000,
        retryAttempts: 3,
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000 // limit each IP to 1000 requests per windowMs
        }
    },

    // Payment & Subscription Configuration
    payments: {
        stripe: {
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
            currency: 'USD',
            subscriptionPlans: {
                basic: {
                    priceId: 'price_basic_monthly',
                    features: ['Basic Analytics', 'Standard Support', '10GB Storage']
                },
                pro: {
                    priceId: 'price_pro_monthly',
                    features: ['Advanced Analytics', 'Priority Support', '100GB Storage', 'AI Features']
                },
                enterprise: {
                    priceId: 'price_enterprise_monthly',
                    features: ['Full Analytics Suite', '24/7 Support', 'Unlimited Storage', 'Custom AI Models']
                }
            }
        },
        paypal: {
            clientId: process.env.PAYPAL_CLIENT_ID || 'paypal_client_id',
            environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
        }
    },

    // Analytics Configuration
    analytics: {
        mixpanel: {
            token: process.env.MIXPANEL_TOKEN || 'mixpanel_token',
            trackPageViews: true,
            trackClicks: true,
            trackFormSubmissions: true
        },
        googleAnalytics: {
            measurementId: process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
            enabled: true
        },
        amplitude: {
            apiKey: process.env.AMPLITUDE_API_KEY || 'amplitude_key',
            trackSessions: true
        },
        customAnalytics: {
            cohortAnalysis: true,
            funnelTracking: true,
            heatmaps: true,
            realTimeAnalytics: true,
            predictiveAnalytics: true
        }
    },

    // AI & Machine Learning Configuration
    ai: {
        tensorflow: {
            modelPath: '/assets/models/',
            recommendationModel: 'recommendation-model.json',
            sentimentModel: 'sentiment-model.json',
            personalizationModel: 'personalization-model.json'
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY || '',
            model: 'gpt-4',
            maxTokens: 2048,
            features: {
                contentGeneration: true,
                grammarChecking: true,
                translation: true,
                summarization: true
            }
        },
        recommendations: {
            algorithm: 'collaborative-filtering',
            updateFrequency: '1h',
            minSimilarityScore: 0.3,
            maxRecommendations: 20
        }
    },

    // Social & Community Features
    social: {
        forums: {
            enabled: true,
            moderationEnabled: true,
            autoModeration: true,
            allowAnonymous: false
        },
        gamification: {
            enabled: true,
            pointsSystem: {
                purchase: 10,
                review: 5,
                referral: 50,
                socialShare: 2
            },
            badges: {
                earlyAdopter: { threshold: 1 },
                loyalCustomer: { threshold: 10 },
                influencer: { threshold: 100 },
                expert: { threshold: 1000 }
            }
        },
        messaging: {
            realTime: true,
            fileUpload: true,
            maxFileSize: '10MB',
            allowedFileTypes: ['image', 'document', 'video']
        }
    },

    // Performance & Caching
    performance: {
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            ttl: 3600, // 1 hour default TTL
            maxMemoryPolicy: 'allkeys-lru'
        },
        cdn: {
            enabled: true,
            provider: 'cloudflare',
            baseUrl: process.env.CDN_BASE_URL || 'https://cdn.shopverse.com',
            imageOptimization: true,
            compression: true
        },
        caching: {
            staticAssets: '1y',
            apiResponses: '5m',
            productCatalog: '1h',
            userSessions: '24h'
        }
    },

    // Security Configuration
    security: {
        authentication: {
            jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
            jwtExpiry: '24h',
            refreshTokenExpiry: '7d',
            maxLoginAttempts: 5,
            lockoutDuration: 900000 // 15 minutes
        },
        mfa: {
            enabled: true,
            methods: ['totp', 'sms', 'email'],
            required: ['admin', 'vendor'],
            optional: ['customer']
        },
        encryption: {
            algorithm: 'aes-256-gcm',
            keyRotationInterval: '30d'
        },
        headers: {
            contentSecurityPolicy: true,
            crossOriginEmbedderPolicy: true,
            crossOriginOpenerPolicy: true,
            crossOriginResourcePolicy: true,
            hidePoweredBy: true,
            hsts: true,
            noSniff: true,
            xssFilter: true
        }
    },

    // Feature Flags
    features: {
        subscriptions: true,
        aiRecommendations: true,
        realTimeChat: true,
        advancedAnalytics: true,
        communityForums: true,
        gamification: true,
        mobileApp: true,
        apiAccess: true,
        enterpriseIntegrations: true,
        customBranding: true,
        whiteLabel: false,
        mlPersonalization: true,
        blockchainIntegration: false,
        voiceCommerce: false,
        arTryOn: false
    },

    // Mobile App Configuration
    mobile: {
        reactNative: {
            version: '0.72.0',
            codeSharing: 80, // percentage of code shared between platforms
            platforms: ['ios', 'android']
        },
        pushNotifications: {
            firebase: {
                serverKey: process.env.FIREBASE_SERVER_KEY || '',
                senderId: process.env.FIREBASE_SENDER_ID || ''
            },
            types: ['order_updates', 'promotions', 'recommendations', 'messages']
        },
        offline: {
            enabled: true,
            syncOnReconnect: true,
            cacheSize: '100MB'
        }
    },

    // Third-party Integrations
    integrations: {
        email: {
            provider: 'mailchimp',
            apiKey: process.env.MAILCHIMP_API_KEY || '',
            defaultList: process.env.MAILCHIMP_DEFAULT_LIST || ''
        },
        sms: {
            provider: 'twilio',
            accountSid: process.env.TWILIO_ACCOUNT_SID || '',
            authToken: process.env.TWILIO_AUTH_TOKEN || ''
        },
        social: {
            facebook: {
                appId: process.env.FACEBOOK_APP_ID || '',
                version: 'v18.0'
            },
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID || '',
                apiKey: process.env.GOOGLE_API_KEY || ''
            },
            twitter: {
                apiKey: process.env.TWITTER_API_KEY || '',
                apiSecret: process.env.TWITTER_API_SECRET || ''
            }
        }
    }
};

// Environment-specific overrides
if (typeof window !== 'undefined') {
    // Browser environment
    window.shopVerseConfig = enterpriseConfig;
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = enterpriseConfig;
}

// Configuration validation
function validateConfig() {
    const required = [
        'api.baseUrl',
        'payments.stripe.publishableKey',
        'analytics.mixpanel.token'
    ];

    const missing = required.filter(path => {
        const value = path.split('.').reduce((obj, key) => obj?.[key], enterpriseConfig);
        return !value || value.includes('...') || value.includes('_key') || value.includes('_token');
    });

    if (missing.length > 0) {
        console.warn('⚠️ Missing enterprise configuration:', missing);
        return false;
    }

    console.log('✅ Enterprise configuration validated successfully');
    return true;
}

// Auto-validate configuration
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', validateConfig);
}