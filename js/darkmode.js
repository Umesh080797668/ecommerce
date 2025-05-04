/**
 * ShopVerse E-commerce Platform
 * Dark Mode Toggle Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
});

/**
 * Initialize Dark Mode functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkmode-toggle');

    if (darkModeToggle) {
        // Check for saved theme preference or respect OS preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        // Initial state setup
        if (savedTheme === 'dark' || (savedTheme === null && prefersDarkMode)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        // Listen for toggle changes
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });

        // Listen for OS theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('theme') === null) {
                if (e.matches) {
                    enableDarkMode(false);
                } else {
                    disableDarkMode(false);
                }
            }
        });
    }

    /**
     * Enable dark mode
     * @param {boolean} savePreference - Whether to save preference to localStorage
     */
    function enableDarkMode(savePreference = true) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
        if (savePreference) localStorage.setItem('theme', 'dark');

        // Dispatch event for other scripts that might need to know about theme change
        document.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: 'dark' } }));
    }

    /**
     * Disable dark mode
     * @param {boolean} savePreference - Whether to save preference to localStorage
     */
    function disableDarkMode(savePreference = true) {
        document.body.classList.remove('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = false;
        if (savePreference) localStorage.setItem('theme', 'light');

        // Dispatch event for other scripts that might need to know about theme change
        document.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: 'light' } }));
    }
}