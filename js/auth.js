/**
 * ShopVerse E-commerce Platform
 * Authentication Pages JavaScript
 * @version 1.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication components
    initFormValidation();
    initPasswordToggle();
    initPasswordStrength();
    initSocialAuth();
    handleFormSubmissions();
});

/**
 * Initialize Form Validation
 */
function initFormValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');

    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });

    // Password validation on register page
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        // Check password match when confirm password changes
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                validatePasswordMatch(passwordInput, this);
            });
        }
    }

    // Reset password form validation
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        // Check password match when confirm password changes
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                validatePasswordMatch(newPasswordInput, this);
            });
        }
    }
}

/**
 * Validate email format
 * @param {HTMLInputElement} input - Email input element
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);

    if (!isValid && input.value) {
        input.classList.add('error');

        // Add error message if not already present
        let errorMessage = input.parentNode.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Please enter a valid email address';
            input.parentNode.appendChild(errorMessage);
        }
    } else {
        input.classList.remove('error');

        // Remove error message if exists
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    return isValid;
}

/**
 * Validate password match
 * @param {HTMLInputElement} passwordInput - Password input element
 * @param {HTMLInputElement} confirmInput - Confirm password input element
 * @returns {boolean} - Whether passwords match
 */
function validatePasswordMatch(passwordInput, confirmInput) {
    const doMatch = passwordInput.value === confirmInput.value;

    if (!doMatch && confirmInput.value) {
        confirmInput.classList.add('error');

        // Add error message if not already present
        let errorMessage = confirmInput.parentNode.parentNode.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Passwords do not match';
            confirmInput.parentNode.parentNode.appendChild(errorMessage);
        }
    } else {
        confirmInput.classList.remove('error');

        // Remove error message if exists
        const errorMessage = confirmInput.parentNode.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    return doMatch;
}

/**
 * Initialize Password Toggle functionality
 */
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) { // Added the event parameter 'e'
            e.preventDefault();

            // Get the input field from the parent input-group
            const input = this.closest('.input-group').querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                // Show password
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                // Hide password
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Initialize Password Strength Meter
 */
function initPasswordStrength() {
    const passwordInputs = document.querySelectorAll('#password, #new-password');

    passwordInputs.forEach(input => {
        if (!input) return;

        const form = input.closest('form');
        if (!form) return;

        const strengthMeter = form.querySelector('.strength-meter');
        const strengthText = form.querySelector('.strength-text');

        if (!strengthMeter || !strengthText) return;

        input.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updateStrengthMeter(strength, strengthMeter, strengthText);

            // Update requirements if they exist
            updatePasswordRequirements(password);
        });
    });
}

/**
 * Calculate password strength score (0-4)
 * @param {string} password - Password to check
 * @returns {number} - Strength score (0-4)
 */
function calculatePasswordStrength(password) {
    if (!password) return 0;

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) score += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) score += 1;

    // Contains number
    if (/[0-9]/.test(password)) score += 1;

    return score;
}

/**
 * Update strength meter visualization
 * @param {number} strength - Strength score (0-4)
 * @param {HTMLElement} meterElement - Strength meter container element
 * @param {HTMLElement} textElement - Text element to update
 */
function updateStrengthMeter(strength, meterElement, textElement) {
    const segments = meterElement.querySelectorAll('.strength-segment');

    // Reset all segments
    segments.forEach(segment => {
        segment.classList.remove('weak', 'medium', 'strong', 'very-strong');
    });

    // Reset text
    textElement.textContent = 'Password strength';
    textElement.className = 'strength-text';

    if (strength === 0) return;

    // Apply classes based on strength
    let strengthClass, strengthLabel;

    switch (strength) {
        case 1:
            strengthClass = 'weak';
            strengthLabel = 'Weak';
            break;
        case 2:
            strengthClass = 'medium';
            strengthLabel = 'Medium';
            break;
        case 3:
            strengthClass = 'strong';
            strengthLabel = 'Strong';
            break;
        case 4:
            strengthClass = 'very-strong';
            strengthLabel = 'Very Strong';
            break;
    }

    // Update segments
    for (let i = 0; i < strength; i++) {
        segments[i].classList.add(strengthClass);
    }

    // Update text
    textElement.textContent = strengthLabel;
    textElement.className = `strength-text ${strengthClass}`;
}

/**
 * Update password requirement indicators
 * @param {string} password - Password to check
 */
function updatePasswordRequirements(password) {
    const reqLength = document.getElementById('req-length');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqNumber = document.getElementById('req-number');

    // If requirements elements don't exist, return
    if (!reqLength || !reqLowercase || !reqUppercase || !reqNumber) return;

    // Check requirements
    const hasLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    // Update requirement indicators
    updateRequirement(reqLength, hasLength);
    updateRequirement(reqLowercase, hasLowercase);
    updateRequirement(reqUppercase, hasUppercase);
    updateRequirement(reqNumber, hasNumber);
}

/**
 * Update a single requirement indicator
 * @param {HTMLElement} element - Requirement element
 * @param {boolean} isValid - Whether requirement is met
 */
function updateRequirement(element, isValid) {
    const icon = element.querySelector('i');

    if (isValid) {
        element.classList.add('valid');
        icon.classList.remove('fa-times-circle');
        icon.classList.add('fa-check-circle');
    } else {
        element.classList.remove('valid');
        icon.classList.remove('fa-check-circle');
        icon.classList.add('fa-times-circle');
    }
}

/**
 * Initialize Social Authentication
 */
function initSocialAuth() {
    const googleBtn = document.querySelector('.btn-social.google');
    const facebookBtn = document.querySelector('.btn-social.facebook');

    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // In a real app, this would trigger Google OAuth flow
            showNotification('Google sign-in would be triggered here', 'info');
        });
    }

    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            // In a real app, this would trigger Facebook OAuth flow
            showNotification('Facebook sign-in would be triggered here', 'info');
        });
    }
}

/**
 * Handle form submissions
 */
function handleFormSubmissions() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate email
            const emailInput = this.querySelector('input[type="email"]');
            if (!validateEmail(emailInput)) return;

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // In a real app, this would be an actual API call

                // For demo, check if using test credentials
                const email = emailInput.value;
                const password = this.querySelector('input[type="password"]').value;

                if (email === 'test@example.com' && password === 'password') {
                    // Success
                    window.location.href = '../index.html';
                } else {
                    // Error
                    submitBtn.innerHTML = 'Login';
                    submitBtn.disabled = false;
                    showNotification('Invalid email or password', 'error');
                }
            }, 1500);
        });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate email
            const emailInput = this.querySelector('input[type="email"]');
            if (!validateEmail(emailInput)) return;

            // Validate password match
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            if (!validatePasswordMatch(passwordInput, confirmPasswordInput)) return;

            // Check if terms checkbox is checked
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox && !termsCheckbox.checked) {
                showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // In a real app, this would be an actual API call

                // For demo, redirect to login page
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate email
            const emailInput = this.querySelector('input[type="email"]');
            if (!validateEmail(emailInput)) return;

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // In a real app, this would be an actual API call

                // For demo, show confirmation screen
                const requestFormContainer = document.getElementById('request-form-container');
                const confirmationContainer = document.getElementById('confirmation-container');
                const sentEmailElement = document.getElementById('sent-email');

                if (requestFormContainer && confirmationContainer && sentEmailElement) {
                    requestFormContainer.style.display = 'none';
                    confirmationContainer.style.display = 'block';
                    sentEmailElement.textContent = emailInput.value;
                }

                // Reset button state
                submitBtn.innerHTML = 'Send Reset Link';
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Reset password form
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate password match
            const newPasswordInput = document.getElementById('new-password');
            const confirmPasswordInput = document.getElementById('confirm-password');
            if (!validatePasswordMatch(newPasswordInput, confirmPasswordInput)) return;

            // Check password requirements
            const password = newPasswordInput.value;
            const hasLength = password.length >= 8;
            const hasLowercase = /[a-z]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);

            if (!hasLength || !hasLowercase || !hasUppercase || !hasNumber) {
                showNotification('Please meet all password requirements', 'error');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // In a real app, this would be an actual API call

                // For demo, show success screen
                const resetFormContainer = document.getElementById('reset-form-container');
                const successContainer = document.getElementById('success-container');

                if (resetFormContainer && successContainer) {
                    resetFormContainer.style.display = 'none';
                    successContainer.style.display = 'block';
                }

                // Reset button state
                submitBtn.innerHTML = 'Reset Password';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <p>${message}</p>
        </div>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}