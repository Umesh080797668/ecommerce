/**
 * ShopVerse E-commerce Platform
 * Dark Mode Toggle Functionality
 * @version 2.0.0
 * Last updated: 2025-05-05
 */

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

/**
 * Initialize dark mode functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkmode-toggle');
    const body = document.body;
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // Check if dark mode was enabled previously
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    // Handle system preference changes
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const checkSystemPreference = () => {
        // Only apply system preference if user hasn't made an explicit choice
        if (localStorage.getItem('darkMode') === null) {
            if (prefersDarkScheme.matches) {
                body.classList.add('dark-mode');
                if (darkModeToggle) darkModeToggle.checked = true;
            } else {
                body.classList.remove('dark-mode');
                if (darkModeToggle) darkModeToggle.checked = false;
            }
        }
    };

    // Check system preference initially
    checkSystemPreference();

    // Listen for changes in system preference
    prefersDarkScheme.addEventListener('change', checkSystemPreference);

    // Toggle dark mode when the switch is clicked
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }

            // Dispatch an event for components that need to react to theme changes
            const themeChangeEvent = new CustomEvent('themechange', {
                detail: { darkMode: this.checked }
            });
            document.dispatchEvent(themeChangeEvent);

            // Fix for specific components that might need reinitialization
            fixSpecificComponents();
        });
    }

    // Add keyboard shortcut for toggling dark mode (Alt+Shift+D)
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'd') {
            if (darkModeToggle) {
                darkModeToggle.checked = !darkModeToggle.checked;
                darkModeToggle.dispatchEvent(new Event('change'));
            } else {
                body.classList.toggle('dark-mode');
                const isDarkModeEnabled = body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkModeEnabled ? 'enabled' : 'disabled');
            }
        }
    });
}

/**
 * Fix specific components that might have issues during dark mode toggle
 */
function fixSpecificComponents() {
    // Fix sliders if they exist
    if (typeof $.fn.slick !== 'undefined' && $('.slider').length > 0) {
        $('.slider').slick('refresh');
    }

    // Fix charts if they exist
    if (typeof Chart !== 'undefined') {
        Chart.instances.forEach(chart => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const textColor = isDarkMode ? '#D1D5DB' : '#4B5563';
            const gridColor = isDarkMode ? '#374151' : '#E5E7EB';

            chart.options.scales.x.grid.color = gridColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.y.ticks.color = textColor;
            chart.update();
        });
    }

    // Fix image brightness for dark mode
    adjustImageBrightness();
}

/**
 * Adjust image brightness for dark mode
 * This adds a subtle filter to non-product images to improve visibility in dark mode
 */
function adjustImageBrightness() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const images = document.querySelectorAll('img:not(.product-image img):not(.logo img)');

    images.forEach(img => {
        if (isDarkMode) {
            img.style.filter = 'brightness(0.85)';
        } else {
            img.style.filter = 'none';
        }
    });
}

/**
 * Handle theme-specific dynamic content updates
 */
document.addEventListener('themechange', function(event) {
    const isDarkMode = event.detail.darkMode;

    // Update theme-dependent content
    updateThemeSpecificContent(isDarkMode);
});

/**
 * Update content that depends on the current theme
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
function updateThemeSpecificContent(isDarkMode) {
    // Update theme-dependent images (e.g., logo variants)
    const logoImage = document.querySelector('.logo img');
    if (logoImage) {
        const darkLogo = logoImage.dataset.darkSrc;
        const lightLogo = logoImage.dataset.lightSrc;

        if (darkLogo && lightLogo) {
            logoImage.src = isDarkMode ? darkLogo : lightLogo;
        }
    }

    // Update theme icons throughout the site
    document.querySelectorAll('[data-light-icon]').forEach(el => {
        const lightClass = el.getAttribute('data-light-icon');
        const darkClass = el.getAttribute('data-dark-icon');

        if (isDarkMode && darkClass) {
            el.className = darkClass;
        } else if (!isDarkMode && lightClass) {
            el.className = lightClass;
        }
    });

    // Update any code syntax highlighting if present
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }
}