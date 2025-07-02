/**
 * ShopVerse Enterprise Analytics System
 * Advanced analytics, cohort analysis, funnel tracking, and business intelligence
 * @version 3.0.0
 */

class EnterpriseAnalytics {
    constructor(config = {}) {
        this.config = { ...window.shopVerseConfig?.analytics, ...config };
        this.eventQueue = [];
        this.sessionId = this.generateSessionId();
        this.userId = null;
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize analytics system
     */
    async init() {
        try {
            // Initialize third-party analytics
            await this.initMixpanel();
            await this.initAmplitude();
            await this.initGoogleAnalytics();
            
            // Initialize custom analytics
            this.initCustomAnalytics();
            this.initCohortAnalysis();
            this.initFunnelTracking();
            this.initHeatmaps();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Process queued events
            this.processEventQueue();
            
            this.isInitialized = true;
            console.log('✅ Enterprise Analytics initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Enterprise Analytics:', error);
        }
    }

    /**
     * Initialize Mixpanel
     */
    async initMixpanel() {
        if (!this.config.mixpanel?.token) return;

        try {
            // Load Mixpanel script dynamically
            if (typeof mixpanel === 'undefined') {
                await this.loadScript('https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js');
            }
            
            mixpanel.init(this.config.mixpanel.token, {
                debug: this.config.debug || false,
                track_pageview: this.config.mixpanel.trackPageViews,
                persistence: 'localStorage'
            });

            console.log('✅ Mixpanel initialized');
        } catch (error) {
            console.error('❌ Mixpanel initialization failed:', error);
        }
    }

    /**
     * Initialize Amplitude
     */
    async initAmplitude() {
        if (!this.config.amplitude?.apiKey) return;

        try {
            if (typeof amplitude === 'undefined') {
                await this.loadScript('https://cdn.amplitude.com/libs/amplitude-8.21.9-min.gz.js');
            }

            amplitude.getInstance().init(this.config.amplitude.apiKey, null, {
                includeUtm: true,
                includeReferrer: true,
                includeGclid: true,
                saveEvents: true,
                trackingSessionEvents: this.config.amplitude.trackSessions
            });

            console.log('✅ Amplitude initialized');
        } catch (error) {
            console.error('❌ Amplitude initialization failed:', error);
        }
    }

    /**
     * Initialize Google Analytics 4
     */
    async initGoogleAnalytics() {
        if (!this.config.googleAnalytics?.measurementId) return;

        try {
            // Load GA4 script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalytics.measurementId}`;
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() { dataLayer.push(arguments); };
            
            gtag('js', new Date());
            gtag('config', this.config.googleAnalytics.measurementId, {
                send_page_view: false // We'll handle this manually
            });

            console.log('✅ Google Analytics 4 initialized');
        } catch (error) {
            console.error('❌ Google Analytics initialization failed:', error);
        }
    }

    /**
     * Initialize custom analytics features
     */
    initCustomAnalytics() {
        this.customAnalytics = {
            pageViews: new Map(),
            userSessions: new Map(),
            conversionFunnels: new Map(),
            cohorts: new Map(),
            heatmapData: [],
            realTimeEvents: []
        };

        // Track page view
        this.trackPageView();
        
        // Track session start
        this.trackEvent('session_start', {
            session_id: this.sessionId,
            timestamp: Date.now(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            referrer: document.referrer
        });
    }

    /**
     * Initialize cohort analysis
     */
    initCohortAnalysis() {
        this.cohortAnalysis = {
            cohorts: new Map(),
            retentionData: new Map(),
            
            createCohort: (cohortId, users, startDate) => {
                this.cohortAnalysis.cohorts.set(cohortId, {
                    id: cohortId,
                    users: users,
                    startDate: startDate,
                    createdAt: new Date()
                });
            },

            trackRetention: (cohortId, userId, day) => {
                const key = `${cohortId}_${day}`;
                if (!this.cohortAnalysis.retentionData.has(key)) {
                    this.cohortAnalysis.retentionData.set(key, new Set());
                }
                this.cohortAnalysis.retentionData.get(key).add(userId);
            },

            getRetentionRate: (cohortId, day) => {
                const cohort = this.cohortAnalysis.cohorts.get(cohortId);
                const retained = this.cohortAnalysis.retentionData.get(`${cohortId}_${day}`);
                
                if (!cohort || !retained) return 0;
                
                return (retained.size / cohort.users.length) * 100;
            }
        };
    }

    /**
     * Initialize funnel tracking
     */
    initFunnelTracking() {
        this.funnelTracking = {
            funnels: new Map(),
            
            createFunnel: (funnelId, steps) => {
                this.funnelTracking.funnels.set(funnelId, {
                    id: funnelId,
                    steps: steps,
                    conversions: new Map(),
                    createdAt: new Date()
                });
            },

            trackFunnelStep: (funnelId, stepId, userId, timestamp = Date.now()) => {
                const funnel = this.funnelTracking.funnels.get(funnelId);
                if (!funnel) return;

                const key = `${funnelId}_${stepId}`;
                if (!funnel.conversions.has(key)) {
                    funnel.conversions.set(key, []);
                }
                
                funnel.conversions.get(key).push({
                    userId: userId,
                    timestamp: timestamp,
                    sessionId: this.sessionId
                });
            },

            getConversionRate: (funnelId, fromStep, toStep) => {
                const funnel = this.funnelTracking.funnels.get(funnelId);
                if (!funnel) return 0;

                const fromUsers = funnel.conversions.get(`${funnelId}_${fromStep}`)?.length || 0;
                const toUsers = funnel.conversions.get(`${funnelId}_${toStep}`)?.length || 0;

                return fromUsers > 0 ? (toUsers / fromUsers) * 100 : 0;
            }
        };

        // Create default e-commerce funnel
        this.funnelTracking.createFunnel('ecommerce', [
            'product_view',
            'add_to_cart',
            'checkout_start',
            'payment_info',
            'purchase'
        ]);
    }

    /**
     * Initialize heatmap tracking
     */
    initHeatmaps() {
        this.heatmaps = {
            clicks: [],
            scrolls: [],
            movements: [],
            
            trackClick: (event) => {
                const rect = event.target.getBoundingClientRect();
                this.heatmaps.clicks.push({
                    x: event.clientX,
                    y: event.clientY,
                    elementX: rect.left + event.offsetX,
                    elementY: rect.top + event.offsetY,
                    element: event.target.tagName,
                    timestamp: Date.now(),
                    page: window.location.pathname
                });
            },

            trackScroll: () => {
                const scrollPercentage = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                this.heatmaps.scrolls.push({
                    percentage: scrollPercentage,
                    timestamp: Date.now(),
                    page: window.location.pathname
                });
            },

            generateHeatmapData: () => {
                return {
                    clicks: this.heatmaps.clicks,
                    scrolls: this.heatmaps.scrolls,
                    movements: this.heatmaps.movements
                };
            }
        };
    }

    /**
     * Set up event listeners for automatic tracking
     */
    setupEventListeners() {
        // Track clicks
        document.addEventListener('click', (event) => {
            if (this.config.mixpanel?.trackClicks) {
                this.trackEvent('click', {
                    element: event.target.tagName,
                    element_id: event.target.id,
                    element_class: event.target.className,
                    page: window.location.pathname
                });
            }
            
            // Heatmap tracking
            this.heatmaps.trackClick(event);
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            if (this.config.mixpanel?.trackFormSubmissions) {
                this.trackEvent('form_submit', {
                    form_id: event.target.id,
                    form_action: event.target.action,
                    page: window.location.pathname
                });
            }
        });

        // Track scroll behavior
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.heatmaps.trackScroll();
            }, 100);
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden', {
                    time_on_page: Date.now() - this.pageStartTime
                });
            } else {
                this.trackEvent('page_visible');
                this.pageStartTime = Date.now();
            }
        });

        // Track errors
        window.addEventListener('error', (event) => {
            this.trackEvent('javascript_error', {
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, properties = {}) {
        const eventData = {
            event: eventName,
            properties: {
                ...properties,
                timestamp: Date.now(),
                session_id: this.sessionId,
                user_id: this.userId,
                page_url: window.location.href,
                page_title: document.title,
                user_agent: navigator.userAgent
            }
        };

        if (!this.isInitialized) {
            this.eventQueue.push(eventData);
            return;
        }

        // Send to all analytics platforms
        try {
            // Mixpanel
            if (typeof mixpanel !== 'undefined') {
                mixpanel.track(eventName, eventData.properties);
            }

            // Amplitude
            if (typeof amplitude !== 'undefined') {
                amplitude.getInstance().logEvent(eventName, eventData.properties);
            }

            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, eventData.properties);
            }

            // Custom analytics
            this.customAnalytics.realTimeEvents.push(eventData);

            // Limit real-time events to prevent memory issues
            if (this.customAnalytics.realTimeEvents.length > 1000) {
                this.customAnalytics.realTimeEvents = this.customAnalytics.realTimeEvents.slice(-500);
            }

        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    /**
     * Track page views
     */
    trackPageView(page = window.location.pathname) {
        this.pageStartTime = Date.now();
        
        const pageData = {
            page: page,
            title: document.title,
            referrer: document.referrer,
            timestamp: Date.now()
        };

        this.trackEvent('page_view', pageData);

        // Update page view count
        const currentCount = this.customAnalytics.pageViews.get(page) || 0;
        this.customAnalytics.pageViews.set(page, currentCount + 1);
    }

    /**
     * Track e-commerce events
     */
    trackEcommerce(action, data = {}) {
        const ecommerceEvents = {
            product_view: () => {
                this.funnelTracking.trackFunnelStep('ecommerce', 'product_view', this.userId);
                this.trackEvent('product_view', data);
            },
            add_to_cart: () => {
                this.funnelTracking.trackFunnelStep('ecommerce', 'add_to_cart', this.userId);
                this.trackEvent('add_to_cart', data);
            },
            checkout_start: () => {
                this.funnelTracking.trackFunnelStep('ecommerce', 'checkout_start', this.userId);
                this.trackEvent('checkout_start', data);
            },
            purchase: () => {
                this.funnelTracking.trackFunnelStep('ecommerce', 'purchase', this.userId);
                this.trackEvent('purchase', {
                    ...data,
                    revenue: data.total_amount,
                    currency: data.currency || 'USD'
                });
            }
        };

        if (ecommerceEvents[action]) {
            ecommerceEvents[action]();
        }
    }

    /**
     * Set user identity
     */
    identify(userId, properties = {}) {
        this.userId = userId;

        try {
            if (typeof mixpanel !== 'undefined') {
                mixpanel.identify(userId);
                mixpanel.people.set(properties);
            }

            if (typeof amplitude !== 'undefined') {
                amplitude.getInstance().setUserId(userId);
                amplitude.getInstance().setUserProperties(properties);
            }

            if (typeof gtag !== 'undefined') {
                gtag('config', this.config.googleAnalytics.measurementId, {
                    user_id: userId
                });
            }

        } catch (error) {
            console.error('Error identifying user:', error);
        }
    }

    /**
     * Generate analytics dashboard data
     */
    getDashboardData() {
        return {
            overview: {
                totalPageViews: Array.from(this.customAnalytics.pageViews.values()).reduce((a, b) => a + b, 0),
                uniquePages: this.customAnalytics.pageViews.size,
                totalEvents: this.customAnalytics.realTimeEvents.length,
                sessionId: this.sessionId
            },
            pageViews: Object.fromEntries(this.customAnalytics.pageViews),
            funnels: this.getFunnelData(),
            cohorts: this.getCohortData(),
            heatmaps: this.heatmaps.generateHeatmapData(),
            realTimeEvents: this.customAnalytics.realTimeEvents.slice(-50) // Last 50 events
        };
    }

    /**
     * Get funnel analysis data
     */
    getFunnelData() {
        const funnelData = {};
        
        for (const [funnelId, funnel] of this.funnelTracking.funnels) {
            funnelData[funnelId] = {
                steps: funnel.steps,
                conversions: {},
                conversionRates: {}
            };

            // Calculate conversions for each step
            for (let i = 0; i < funnel.steps.length; i++) {
                const step = funnel.steps[i];
                const stepKey = `${funnelId}_${step}`;
                const conversions = funnel.conversions.get(stepKey) || [];
                
                funnelData[funnelId].conversions[step] = conversions.length;
                
                // Calculate conversion rate from previous step
                if (i > 0) {
                    const prevStep = funnel.steps[i - 1];
                    const prevConversions = funnelData[funnelId].conversions[prevStep];
                    funnelData[funnelId].conversionRates[step] = 
                        prevConversions > 0 ? (conversions.length / prevConversions) * 100 : 0;
                }
            }
        }

        return funnelData;
    }

    /**
     * Get cohort analysis data
     */
    getCohortData() {
        const cohortData = {};
        
        for (const [cohortId, cohort] of this.cohortAnalysis.cohorts) {
            cohortData[cohortId] = {
                ...cohort,
                retentionRates: {}
            };

            // Calculate retention rates for 1, 7, 14, 30 days
            [1, 7, 14, 30].forEach(day => {
                cohortData[cohortId].retentionRates[`day_${day}`] = 
                    this.cohortAnalysis.getRetentionRate(cohortId, day);
            });
        }

        return cohortData;
    }

    /**
     * Helper methods
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    processEventQueue() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            this.trackEvent(event.event, event.properties);
        }
    }
}

// Initialize Enterprise Analytics
window.enterpriseAnalytics = new EnterpriseAnalytics();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnterpriseAnalytics;
}