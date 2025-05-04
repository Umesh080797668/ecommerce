/**
 * ShopVerse E-commerce Platform
 * 3D Effects and Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    init3DEffects();
    initParallaxEffects();
    initSmoothScrolling();
    initImageHoverEffects();
    initMouseTrailing();
});

/**
 * Initialize 3D Effects
 */
function init3DEffects() {
    // 3D Card Effect
    const cards = document.querySelectorAll('.product-card, .category-card, .feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            // Check if 3D effects should be disabled (for mobile or settings)
            if (window.innerWidth <= 768 || !isEffectsEnabled()) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element

            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (limited to max 5 degrees)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

/**
 * Initialize Parallax Effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-background');

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        if (!isEffectsEnabled()) return;

        const scrollTop = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = 0.5;
            const offset = scrollTop * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    });

    // Hero section 3D layers
    const scene = document.querySelector('.scene');
    if (scene) {
        window.addEventListener('mousemove', e => {
            if (!isEffectsEnabled()) return;

            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            // Get all scene elements
            const elements = scene.querySelectorAll('.scene-element');

            elements.forEach(element => {
                // Get element's z-index for depth calculation
                const depth = parseInt(window.getComputedStyle(element).zIndex) || 1;
                const moveX = mouseX * depth * 10;
                const moveY = mouseY * depth * 10;

                // Apply transform
                element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        });
    }
}

/**
 * Initialize Smooth Scrolling
 */
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize Image Hover Effects
 */
function initImageHoverEffects() {
    const productImages = document.querySelectorAll('.product-thumb img');

    productImages.forEach(img => {
        // Tilt effect on hover
        img.addEventListener('mousemove', e => {
            if (window.innerWidth <= 768 || !isEffectsEnabled()) return;

            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate the skew based on mouse position
            const skewX = ((y - centerY) / centerY) * 5;
            const skewY = ((x - centerX) / centerX) * 5;

            // Apply the transform
            img.style.transform = `scale(1.05) skew(${skewX * 0.2}deg, ${skewY * 0.2}deg)`;
        });

        // Reset on mouse leave
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

/**
 * Initialize Mouse Trailing Effect
 */
function initMouseTrailing() {
    // Create cursor trailer element
    const cursorTrailer = document.createElement('div');
    cursorTrailer.className = 'cursor-trailer';
    document.body.appendChild(cursorTrailer);

    // Track mouse movement
    document.addEventListener('mousemove', e => {
        if (!isEffectsEnabled()) {
            cursorTrailer.style.display = 'none';
            return;
        }

        cursorTrailer.style.display = 'block';

        // Delayed follow effect
        setTimeout(() => {
            cursorTrailer.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }, 100);

        // Check if hovering over interactive elements
        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
        if (hoveredElement && (
                hoveredElement.tagName === 'A' ||
                hoveredElement.tagName === 'BUTTON' ||
                hoveredElement.closest('a') ||
                hoveredElement.closest('button')
            )) {
            cursorTrailer.classList.add('hover');
        } else {
            cursorTrailer.classList.remove('hover');
        }
    });

    // Hide when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        cursorTrailer.style.display = 'none';
    });
}

/**
 * Check if visual effects should be enabled
 * @returns {boolean} Whether effects should be enabled
 */
function isEffectsEnabled() {
    // Check for saved preference or reduced motion setting
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const savedPreference = localStorage.getItem('effects-enabled');

    if (savedPreference !== null) {
        return savedPreference === 'true';
    }

    return !prefersReducedMotion;
}

/**
 * Apply CSS Styles for 3D Effects
 */
(function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cursor-trailer {
            position: fixed;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: rgba(74, 108, 247, 0.2);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.2s ease-out, background-color 0.3s ease;
            display: none;
        }
        
        .cursor-trailer.hover {
                        background-color: rgba(74, 108, 247, 0.4);
            width: 50px;
            height: 50px;
        }
        
        .scene-element {
            position: absolute;
            background-color: rgba(74, 108, 247, 0.2);
            box-shadow: 0 0 15px rgba(74, 108, 247, 0.3);
            animation: float 8s infinite ease-in-out;
            transition: transform 0.3s ease-out;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-15px) translateX(10px);
            }
            50% {
                transform: translateY(5px) translateX(-5px);
            }
            75% {
                transform: translateY(10px) translateX(15px);
            }
        }
        
        .product-card, .category-card, .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            transform-style: preserve-3d;
        }
        
        .dark-mode .cursor-trailer {
            background-color: rgba(109, 141, 255, 0.2);
        }
        
        .dark-mode .cursor-trailer.hover {
            background-color: rgba(109, 141, 255, 0.4);
        }
    `;
    document.head.appendChild(style);
})();