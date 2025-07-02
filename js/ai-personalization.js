/**
 * ShopVerse AI Personalization Engine
 * Machine learning powered recommendations and content personalization
 * @version 3.0.0
 */

class AIPersonalizationEngine {
    constructor() {
        this.config = window.shopVerseConfig?.ai || {};
        this.models = {};
        this.userProfile = {};
        this.recommendations = [];
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize AI engine
     */
    async init() {
        try {
            await this.loadTensorFlow();
            await this.loadBrainJS();
            await this.loadModels();
            await this.buildUserProfile();
            
            this.setupRealtimePersonalization();
            this.isInitialized = true;
            
            console.log('✅ AI Personalization Engine initialized');
        } catch (error) {
            console.error('❌ Failed to initialize AI Engine:', error);
        }
    }

    /**
     * Load TensorFlow.js
     */
    async loadTensorFlow() {
        if (typeof tf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
        }
    }

    /**
     * Load Brain.js
     */
    async loadBrainJS() {
        if (typeof brain === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/brain.js@2.0.0/dist/brain.min.js';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
        }
    }

    /**
     * Load pre-trained models
     */
    async loadModels() {
        try {
            // Load recommendation model
            if (this.config.tensorflow?.recommendationModel) {
                this.models.recommendation = await tf.loadLayersModel(
                    this.config.tensorflow.modelPath + this.config.tensorflow.recommendationModel
                );
            }

            // Load sentiment analysis model
            if (this.config.tensorflow?.sentimentModel) {
                this.models.sentiment = await tf.loadLayersModel(
                    this.config.tensorflow.modelPath + this.config.tensorflow.sentimentModel
                );
            }

            // Initialize collaborative filtering neural network
            this.initCollaborativeFiltering();

            // Initialize content-based filtering
            this.initContentBasedFiltering();

            console.log('✅ AI models loaded successfully');
        } catch (error) {
            console.warn('⚠️ Some AI models failed to load, using fallback algorithms');
            this.initFallbackModels();
        }
    }

    /**
     * Initialize collaborative filtering neural network
     */
    initCollaborativeFiltering() {
        this.models.collaborative = new brain.NeuralNetwork({
            inputSize: 50,  // Number of products/features
            hiddenLayers: [25, 15, 10],
            outputSize: 20, // Number of recommendations
            learningRate: 0.001,
            activation: 'sigmoid'
        });

        // Initialize with sample training data if available
        this.trainCollaborativeModel();
    }

    /**
     * Initialize content-based filtering
     */
    initContentBasedFiltering() {
        this.contentFilter = {
            calculateSimilarity: (item1, item2) => {
                // Calculate cosine similarity between items
                const features1 = this.extractFeatures(item1);
                const features2 = this.extractFeatures(item2);
                
                return this.cosineSimilarity(features1, features2);
            },

            extractFeatures: (item) => {
                return {
                    category: item.category_id,
                    price_range: this.getPriceRange(item.price),
                    brand: item.brand_id,
                    rating: item.average_rating || 0,
                    popularity: item.view_count || 0
                };
            },

            getPriceRange: (price) => {
                if (price < 25) return 1;
                if (price < 50) return 2;
                if (price < 100) return 3;
                if (price < 200) return 4;
                return 5;
            }
        };
    }

    /**
     * Train collaborative filtering model
     */
    async trainCollaborativeModel() {
        try {
            // Get user interaction data
            const trainingData = await this.getTrainingData();
            
            if (trainingData.length > 0) {
                this.models.collaborative.train(trainingData, {
                    iterations: 1000,
                    errorThresh: 0.005,
                    logPeriod: 100
                });
                
                console.log('✅ Collaborative filtering model trained');
            }
        } catch (error) {
            console.warn('⚠️ Could not train collaborative model:', error);
        }
    }

    /**
     * Build user profile from behavior data
     */
    async buildUserProfile() {
        try {
            const userId = shopVerse.user.id;
            if (!userId) return;

            // Get user behavior data
            const behaviorData = await this.getUserBehaviorData(userId);
            
            this.userProfile = {
                userId: userId,
                preferences: this.analyzePreferences(behaviorData),
                categories: this.getCategoryAffinities(behaviorData),
                priceRange: this.getPreferredPriceRange(behaviorData),
                brands: this.getBrandAffinities(behaviorData),
                seasonality: this.getSeasonalPatterns(behaviorData),
                timePreferences: this.getTimePreferences(behaviorData),
                devicePreferences: this.getDevicePreferences(behaviorData),
                lastUpdated: Date.now()
            };

            console.log('✅ User profile built successfully');
        } catch (error) {
            console.error('Error building user profile:', error);
        }
    }

    /**
     * Get product recommendations
     */
    async getRecommendations(options = {}) {
        const {
            count = 10,
            category = null,
            excludeViewed = true,
            includeNewArrivals = true,
            priceRange = null
        } = options;

        try {
            // Combine different recommendation strategies
            const collaborativeRecs = await this.getCollaborativeRecommendations(count);
            const contentRecs = await this.getContentBasedRecommendations(count);
            const trendingRecs = await this.getTrendingRecommendations(count);
            const personalizedRecs = await this.getPersonalizedRecommendations(count);

            // Merge and rank recommendations
            const allRecommendations = [
                ...collaborativeRecs.map(r => ({ ...r, source: 'collaborative', weight: 0.4 })),
                ...contentRecs.map(r => ({ ...r, source: 'content', weight: 0.3 })),
                ...trendingRecs.map(r => ({ ...r, source: 'trending', weight: 0.2 })),
                ...personalizedRecs.map(r => ({ ...r, source: 'personalized', weight: 0.5 }))
            ];

            // Remove duplicates and apply filters
            const uniqueRecs = this.removeDuplicates(allRecommendations);
            const filteredRecs = this.applyFilters(uniqueRecs, options);
            
            // Rank by combined score
            const rankedRecs = this.rankRecommendations(filteredRecs);

            // Track recommendation event
            window.enterpriseAnalytics?.trackEvent('recommendations_generated', {
                count: rankedRecs.length,
                strategies_used: ['collaborative', 'content', 'trending', 'personalized']
            });

            return rankedRecs.slice(0, count);
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return await this.getFallbackRecommendations(count);
        }
    }

    /**
     * Get collaborative filtering recommendations
     */
    async getCollaborativeRecommendations(count) {
        if (!this.models.collaborative) return [];

        try {
            // Create input vector from user profile
            const inputVector = this.createUserVector();
            const output = this.models.collaborative.run(inputVector);
            
            // Convert output to product recommendations
            return this.convertOutputToProducts(output, count);
        } catch (error) {
            console.error('Error in collaborative filtering:', error);
            return [];
        }
    }

    /**
     * Get content-based recommendations
     */
    async getContentBasedRecommendations(count) {
        try {
            // Get recently viewed/purchased items
            const recentItems = await this.getRecentUserItems();
            if (recentItems.length === 0) return [];

            // Get all products
            const allProducts = await this.getAllProducts();
            const recommendations = [];

            // Find similar items for each recent item
            for (const recentItem of recentItems) {
                for (const product of allProducts) {
                    if (product.id === recentItem.id) continue;

                    const similarity = this.contentFilter.calculateSimilarity(recentItem, product);
                    if (similarity > this.config.recommendations?.minSimilarityScore || 0.3) {
                        recommendations.push({
                            ...product,
                            similarity: similarity,
                            basedOn: recentItem.id
                        });
                    }
                }
            }

            // Sort by similarity and return top recommendations
            return recommendations
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, count);
        } catch (error) {
            console.error('Error in content-based filtering:', error);
            return [];
        }
    }

    /**
     * Get trending recommendations
     */
    async getTrendingRecommendations(count) {
        try {
            const response = await fetch('/api/products/trending');
            const trendingProducts = await response.json();
            
            return trendingProducts.slice(0, count).map(product => ({
                ...product,
                trending_score: product.view_count + product.order_count * 5
            }));
        } catch (error) {
            console.error('Error getting trending recommendations:', error);
            return [];
        }
    }

    /**
     * Get personalized recommendations based on user profile
     */
    async getPersonalizedRecommendations(count) {
        if (!this.userProfile.preferences) return [];

        try {
            const response = await fetch('/api/products/personalized', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    user_profile: this.userProfile,
                    count: count
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Error getting personalized recommendations:', error);
            return [];
        }
    }

    /**
     * Analyze user preferences from behavior data
     */
    analyzePreferences(behaviorData) {
        const preferences = {
            categories: {},
            brands: {},
            priceRanges: {},
            colors: {},
            sizes: {}
        };

        behaviorData.forEach(item => {
            // Category preferences
            if (item.category) {
                preferences.categories[item.category] = 
                    (preferences.categories[item.category] || 0) + item.weight;
            }

            // Brand preferences
            if (item.brand) {
                preferences.brands[item.brand] = 
                    (preferences.brands[item.brand] || 0) + item.weight;
            }

            // Price range preferences
            const priceRange = this.contentFilter.getPriceRange(item.price);
            preferences.priceRanges[priceRange] = 
                (preferences.priceRanges[priceRange] || 0) + item.weight;
        });

        return preferences;
    }

    /**
     * Real-time personalization based on current session
     */
    setupRealtimePersonalization() {
        // Track page views
        this.trackPageView = (productId, category) => {
            this.updateUserProfile({
                type: 'view',
                productId: productId,
                category: category,
                timestamp: Date.now(),
                weight: 1
            });
        };

        // Track add to cart
        this.trackAddToCart = (productId, price, category) => {
            this.updateUserProfile({
                type: 'add_to_cart',
                productId: productId,
                price: price,
                category: category,
                timestamp: Date.now(),
                weight: 3
            });
        };

        // Track purchases
        this.trackPurchase = (products) => {
            products.forEach(product => {
                this.updateUserProfile({
                    type: 'purchase',
                    productId: product.id,
                    price: product.price,
                    category: product.category,
                    timestamp: Date.now(),
                    weight: 5
                });
            });
        };

        // Auto-update recommendations
        setInterval(() => {
            this.updateRecommendations();
        }, 300000); // Every 5 minutes
    }

    /**
     * Update user profile with new behavior data
     */
    updateUserProfile(behaviorData) {
        // Update category affinities
        if (behaviorData.category) {
            if (!this.userProfile.categories) this.userProfile.categories = {};
            this.userProfile.categories[behaviorData.category] = 
                (this.userProfile.categories[behaviorData.category] || 0) + behaviorData.weight;
        }

        // Update price range preferences
        if (behaviorData.price) {
            const priceRange = this.contentFilter.getPriceRange(behaviorData.price);
            if (!this.userProfile.priceRange) this.userProfile.priceRange = {};
            this.userProfile.priceRange[priceRange] = 
                (this.userProfile.priceRange[priceRange] || 0) + behaviorData.weight;
        }

        this.userProfile.lastUpdated = Date.now();
    }

    /**
     * Sentiment analysis for reviews and content
     */
    async analyzeSentiment(text) {
        try {
            if (this.models.sentiment) {
                // Use TensorFlow model for sentiment analysis
                const tokens = this.tokenizeText(text);
                const input = tf.tensor2d([tokens]);
                const prediction = this.models.sentiment.predict(input);
                const sentiment = await prediction.data();
                
                return {
                    score: sentiment[0],
                    label: sentiment[0] > 0.5 ? 'positive' : 'negative',
                    confidence: Math.abs(sentiment[0] - 0.5) * 2
                };
            } else {
                // Fallback to simple keyword-based sentiment analysis
                return this.simpleSentimentAnalysis(text);
            }
        } catch (error) {
            console.error('Error in sentiment analysis:', error);
            return { score: 0.5, label: 'neutral', confidence: 0 };
        }
    }

    /**
     * Simple sentiment analysis fallback
     */
    simpleSentimentAnalysis(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'fantastic'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointing'];
        
        const words = text.toLowerCase().split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        });
        
        const total = positiveCount + negativeCount;
        if (total === 0) return { score: 0.5, label: 'neutral', confidence: 0 };
        
        const score = positiveCount / total;
        return {
            score: score,
            label: score > 0.5 ? 'positive' : 'negative',
            confidence: Math.abs(score - 0.5) * 2
        };
    }

    /**
     * A/B testing for recommendations
     */
    setupABTesting() {
        this.abTests = {
            recommendationAlgorithm: {
                variants: ['collaborative', 'content', 'hybrid'],
                userAssignment: new Map(),
                
                getVariant: (userId) => {
                    if (!this.abTests.recommendationAlgorithm.userAssignment.has(userId)) {
                        const variants = this.abTests.recommendationAlgorithm.variants;
                        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
                        this.abTests.recommendationAlgorithm.userAssignment.set(userId, randomVariant);
                    }
                    return this.abTests.recommendationAlgorithm.userAssignment.get(userId);
                }
            }
        };
    }

    /**
     * Utility functions
     */
    cosineSimilarity(vecA, vecB) {
        const dotProduct = Object.keys(vecA).reduce((sum, key) => {
            return sum + (vecA[key] * (vecB[key] || 0));
        }, 0);
        
        const magnitudeA = Math.sqrt(Object.values(vecA).reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(Object.values(vecB).reduce((sum, val) => sum + val * val, 0));
        
        return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
    }

    extractFeatures(item) {
        return this.contentFilter.extractFeatures(item);
    }

    removeDuplicates(recommendations) {
        const seen = new Set();
        return recommendations.filter(rec => {
            if (seen.has(rec.id)) return false;
            seen.add(rec.id);
            return true;
        });
    }

    rankRecommendations(recommendations) {
        return recommendations.sort((a, b) => {
            const scoreA = (a.similarity || 0) * a.weight + (a.trending_score || 0) * 0.1;
            const scoreB = (b.similarity || 0) * b.weight + (b.trending_score || 0) * 0.1;
            return scoreB - scoreA;
        });
    }

    getAuthToken() {
        return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }

    /**
     * Initialize fallback models if main models fail to load
     */
    initFallbackModels() {
        console.log('Initializing fallback recommendation algorithms...');
        // Implement simpler recommendation logic as fallback
    }

    /**
     * API calls (these would be implemented on the backend)
     */
    async getUserBehaviorData(userId) {
        // Mock data for demonstration
        return [
            { category: 'electronics', brand: 'apple', price: 999, weight: 5 },
            { category: 'clothing', brand: 'nike', price: 89, weight: 3 }
        ];
    }

    async getTrainingData() {
        // Mock training data
        return [];
    }

    async getRecentUserItems() {
        // Mock recent items
        return [];
    }

    async getAllProducts() {
        // Mock products
        return [];
    }

    async getFallbackRecommendations(count) {
        // Return popular/trending products as fallback
        return [];
    }
}

// Initialize AI Personalization Engine
window.aiPersonalization = new AIPersonalizationEngine();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIPersonalizationEngine;
}