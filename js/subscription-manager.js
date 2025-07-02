/**
 * ShopVerse Subscription System
 * Advanced subscription management with Stripe integration
 * @version 3.0.0
 */

class SubscriptionManager {
    constructor() {
        this.config = window.shopVerseConfig?.payments?.stripe || {};
        this.stripe = null;
        this.currentSubscription = null;
        this.paymentMethods = [];
        this.isInitialized = false;

        this.init();
    }

    /**
     * Initialize Stripe and subscription system
     */
    async init() {
        try {
            await this.loadStripe();
            await this.loadSubscriptionData();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Subscription Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Subscription Manager:', error);
        }
    }

    /**
     * Load Stripe.js
     */
    async loadStripe() {
        if (typeof Stripe === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
        }

        this.stripe = Stripe(this.config.publishableKey);
    }

    /**
     * Load current subscription data
     */
    async loadSubscriptionData() {
        try {
            // Get current user subscription
            const response = await fetch('/api/subscriptions/current', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.currentSubscription = await response.json();
            }

            // Load payment methods
            await this.loadPaymentMethods();
        } catch (error) {
            console.error('Error loading subscription data:', error);
        }
    }

    /**
     * Load user's saved payment methods
     */
    async loadPaymentMethods() {
        try {
            const response = await fetch('/api/payment-methods', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.paymentMethods = await response.json();
            }
        } catch (error) {
            console.error('Error loading payment methods:', error);
        }
    }

    /**
     * Create subscription
     */
    async createSubscription(planId, paymentMethodId = null, trialDays = null) {
        try {
            const payload = {
                price_id: planId,
                payment_method_id: paymentMethodId,
                trial_days: trialDays
            };

            const response = await fetch('/api/subscriptions/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === 'incomplete' && result.payment_intent) {
                // Handle 3D Secure or other authentication
                const { error } = await this.stripe.confirmCardPayment(
                    result.payment_intent.client_secret
                );

                if (error) {
                    throw new Error(error.message);
                }
            }

            this.currentSubscription = result.subscription;
            this.onSubscriptionUpdate(result.subscription);

            return result;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    /**
     * Update subscription
     */
    async updateSubscription(newPlanId) {
        try {
            const response = await fetch('/api/subscriptions/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription_id: this.currentSubscription.id,
                    new_price_id: newPlanId
                })
            });

            const result = await response.json();
            this.currentSubscription = result.subscription;
            this.onSubscriptionUpdate(result.subscription);

            return result;
        } catch (error) {
            console.error('Error updating subscription:', error);
            throw error;
        }
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(cancelImmediately = false) {
        try {
            const response = await fetch('/api/subscriptions/cancel', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription_id: this.currentSubscription.id,
                    cancel_immediately: cancelImmediately
                })
            });

            const result = await response.json();
            this.currentSubscription = result.subscription;
            this.onSubscriptionUpdate(result.subscription);

            return result;
        } catch (error) {
            console.error('Error canceling subscription:', error);
            throw error;
        }
    }

    /**
     * Reactivate canceled subscription
     */
    async reactivateSubscription() {
        try {
            const response = await fetch('/api/subscriptions/reactivate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription_id: this.currentSubscription.id
                })
            });

            const result = await response.json();
            this.currentSubscription = result.subscription;
            this.onSubscriptionUpdate(result.subscription);

            return result;
        } catch (error) {
            console.error('Error reactivating subscription:', error);
            throw error;
        }
    }

    /**
     * Create payment method
     */
    async createPaymentMethod(cardElement) {
        try {
            const { error, paymentMethod } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: shopVerse.user.name,
                    email: shopVerse.user.email
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            // Save payment method to customer
            const response = await fetch('/api/payment-methods/save', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    payment_method_id: paymentMethod.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save payment method');
            }

            await this.loadPaymentMethods();
            return paymentMethod;
        } catch (error) {
            console.error('Error creating payment method:', error);
            throw error;
        }
    }

    /**
     * Delete payment method
     */
    async deletePaymentMethod(paymentMethodId) {
        try {
            const response = await fetch(`/api/payment-methods/${paymentMethodId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete payment method');
            }

            await this.loadPaymentMethods();
        } catch (error) {
            console.error('Error deleting payment method:', error);
            throw error;
        }
    }

    /**
     * Get subscription analytics
     */
    async getSubscriptionAnalytics() {
        try {
            const response = await fetch('/api/subscriptions/analytics', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Error getting subscription analytics:', error);
            return null;
        }
    }

    /**
     * Apply promo code
     */
    async applyPromoCode(promoCode) {
        try {
            const response = await fetch('/api/subscriptions/promo-code', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription_id: this.currentSubscription?.id,
                    promo_code: promoCode
                })
            });

            const result = await response.json();
            
            if (this.currentSubscription) {
                this.currentSubscription = result.subscription;
                this.onSubscriptionUpdate(result.subscription);
            }

            return result;
        } catch (error) {
            console.error('Error applying promo code:', error);
            throw error;
        }
    }

    /**
     * Get available plans
     */
    getAvailablePlans() {
        return this.config.subscriptionPlans || {};
    }

    /**
     * Check if user has active subscription
     */
    hasActiveSubscription() {
        return this.currentSubscription && 
               ['active', 'trialing'].includes(this.currentSubscription.status);
    }

    /**
     * Check if user has specific plan
     */
    hasPlan(planName) {
        if (!this.hasActiveSubscription()) return false;
        
        const plans = this.getAvailablePlans();
        const plan = plans[planName];
        
        return plan && this.currentSubscription.items.data.some(
            item => item.price.id === plan.priceId
        );
    }

    /**
     * Get current plan details
     */
    getCurrentPlan() {
        if (!this.hasActiveSubscription()) return null;

        const plans = this.getAvailablePlans();
        const currentPriceId = this.currentSubscription.items.data[0]?.price.id;

        for (const [planName, planDetails] of Object.entries(plans)) {
            if (planDetails.priceId === currentPriceId) {
                return {
                    name: planName,
                    ...planDetails
                };
            }
        }

        return null;
    }

    /**
     * Check feature access
     */
    hasFeatureAccess(feature) {
        const currentPlan = this.getCurrentPlan();
        if (!currentPlan) return false;

        return currentPlan.features.includes(feature);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for subscription plan buttons
        document.addEventListener('click', (event) => {
            if (event.target.matches('[data-subscribe-plan]')) {
                const planId = event.target.getAttribute('data-subscribe-plan');
                this.showSubscriptionModal(planId);
            }

            if (event.target.matches('[data-cancel-subscription]')) {
                this.showCancelModal();
            }

            if (event.target.matches('[data-update-payment-method]')) {
                this.showPaymentMethodModal();
            }
        });

        // Handle subscription form submissions
        const subscriptionForm = document.getElementById('subscription-form');
        if (subscriptionForm) {
            subscriptionForm.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleSubscriptionFormSubmit(event);
            });
        }
    }

    /**
     * Show subscription modal
     */
    showSubscriptionModal(planId) {
        const plans = this.getAvailablePlans();
        const plan = Object.entries(plans).find(([key, value]) => value.priceId === planId);
        
        if (!plan) return;

        const [planName, planDetails] = plan;
        
        // Create modal HTML
        const modalHTML = `
            <div class="subscription-modal-overlay" id="subscription-modal">
                <div class="subscription-modal">
                    <div class="subscription-modal-header">
                        <h3>Subscribe to ${planName.charAt(0).toUpperCase() + planName.slice(1)}</h3>
                        <button class="modal-close" onclick="this.closest('.subscription-modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="subscription-modal-body">
                        <div class="plan-details">
                            <h4>Features included:</h4>
                            <ul>
                                ${planDetails.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        <form id="subscription-form">
                            <div class="payment-method-section">
                                <h4>Payment Method</h4>
                                <div id="card-element" class="card-element"></div>
                                <div id="card-errors" class="error-message"></div>
                            </div>
                            <div class="promo-code-section">
                                <input type="text" id="promo-code" placeholder="Promo code (optional)">
                            </div>
                            <button type="submit" class="btn btn-primary" id="subscribe-btn">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup Stripe Elements
        this.setupStripeElements();
    }

    /**
     * Setup Stripe Elements
     */
    setupStripeElements() {
        const elements = this.stripe.elements();
        const cardElement = elements.create('card');
        cardElement.mount('#card-element');

        cardElement.on('change', ({ error }) => {
            const displayError = document.getElementById('card-errors');
            if (error) {
                displayError.textContent = error.message;
            } else {
                displayError.textContent = '';
            }
        });

        // Store card element for form submission
        this.cardElement = cardElement;
    }

    /**
     * Handle subscription form submit
     */
    async handleSubscriptionFormSubmit(event) {
        const submitButton = event.target.querySelector('#subscribe-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        try {
            // Create payment method
            const paymentMethod = await this.createPaymentMethod(this.cardElement);
            
            // Get plan ID from modal
            const planId = event.target.closest('.subscription-modal').querySelector('[data-subscribe-plan]')?.getAttribute('data-subscribe-plan');
            
            // Get promo code
            const promoCode = document.getElementById('promo-code')?.value;

            // Create subscription
            const result = await this.createSubscription(planId, paymentMethod.id);

            // Apply promo code if provided
            if (promoCode) {
                await this.applyPromoCode(promoCode);
            }

            // Close modal and show success
            document.getElementById('subscription-modal').remove();
            this.showNotification('Subscription created successfully!', 'success');

            // Track analytics
            window.enterpriseAnalytics?.trackEvent('subscription_created', {
                plan_id: planId,
                payment_method: paymentMethod.type
            });

        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Subscribe Now';
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Subscription update callback
     */
    onSubscriptionUpdate(subscription) {
        // Update UI elements
        this.updateSubscriptionUI(subscription);
        
        // Track analytics
        window.enterpriseAnalytics?.trackEvent('subscription_updated', {
            subscription_id: subscription.id,
            status: subscription.status
        });

        // Emit custom event
        window.dispatchEvent(new CustomEvent('subscriptionUpdated', {
            detail: subscription
        }));
    }

    /**
     * Update subscription UI
     */
    updateSubscriptionUI(subscription) {
        // Update subscription status displays
        const statusElements = document.querySelectorAll('[data-subscription-status]');
        statusElements.forEach(element => {
            element.textContent = subscription.status;
            element.className = `subscription-status ${subscription.status}`;
        });

        // Update feature access
        this.updateFeatureAccess();
    }

    /**
     * Update feature access UI
     */
    updateFeatureAccess() {
        const currentPlan = this.getCurrentPlan();
        
        document.querySelectorAll('[data-feature-required]').forEach(element => {
            const requiredFeature = element.getAttribute('data-feature-required');
            const hasAccess = this.hasFeatureAccess(requiredFeature);
            
            element.style.display = hasAccess ? 'block' : 'none';
        });

        // Update premium content
        document.querySelectorAll('.premium-content').forEach(element => {
            if (this.hasActiveSubscription()) {
                element.classList.remove('locked');
            } else {
                element.classList.add('locked');
            }
        });
    }

    /**
     * Get auth token
     */
    getAuthToken() {
        return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
}

// Initialize subscription manager
window.subscriptionManager = new SubscriptionManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SubscriptionManager;
}