/**
 * Configuration options for the img-cards block
 * @type {Object}
 */
const DEFAULT_CONFIG = {
    lazyLoadThreshold: 2, // Number of cards to load eagerly
    animationDuration: '0.2s',
    observerRootMargin: '50px',
    cardSelector: '.img-card',
    titleSelector: '.img-card-title',
    descriptionSelector: '.img-card-description'
};

/**
 * Handles image loading errors
 * @param {HTMLImageElement} img - The image element that failed to load
 */
function handleImageError(img) {
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" alignment-baseline="middle" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
    img.alt = 'Image failed to load';
    console.warn('Image failed to load:', img.src);
}

/**
 * Decorates the img-cards block
 * @param {HTMLElement} block - The block element to decorate
 * @param {Object} [config] - Optional configuration object
 */
export default function decorate(block, config = {}) {
    // Merge configuration
    const options = { ...DEFAULT_CONFIG, ...config };

    // Add classes and ARIA role to main container
    block.classList.add('img-cards-container');
    block.setAttribute('role', 'region');
    block.setAttribute('aria-label', 'Feature Cards');
    block.setAttribute('role', 'list'); // For better screen reader experience

    // Add reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Convert direct div children to card elements
    const cards = [...block.children];
    cards.forEach((card, index) => {
        try {
            // Add classes and make card focusable
            card.classList.add('img-card');
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'listitem');
            card.setAttribute('aria-label', `Card ${index + 1} of ${cards.length}`);

            // Get the image and content divs
            const [imageDiv, contentDiv] = card.children;

            // Handle image container
            if (imageDiv) {
                imageDiv.classList.add('img-card-image');
                const picture = imageDiv.querySelector('picture');
                if (picture) {
                    picture.classList.add('img-card-picture');
                    const img = picture.querySelector('img');
                    if (img) {
                        // Add lazy loading for images below the threshold
                        if (index >= options.lazyLoadThreshold) {
                            img.setAttribute('loading', 'lazy');
                        }
                        // Ensure image has alt text
                        if (!img.hasAttribute('alt')) {
                            img.setAttribute('alt', '');
                        }
                        // Add decoding attribute for performance
                        img.setAttribute('decoding', 'async');
                        // Add error handling
                        img.addEventListener('error', () => handleImageError(img));
                    }
                }
            }

            // Handle content container
            if (contentDiv) {
                contentDiv.classList.add('img-card-content');
                const paragraphs = contentDiv.querySelectorAll('p');
                paragraphs.forEach((p, pIndex) => {
                    if (pIndex === 0) {
                        p.classList.add('img-card-title');
                        // Make title semantically correct
                        const strong = p.querySelector('strong');
                        if (strong) {
                            const titleText = strong.textContent;
                            const h2 = document.createElement('h2');
                            h2.textContent = titleText;
                            h2.className = 'img-card-title';
                            h2.setAttribute('id', `card-title-${index}`);
                            p.replaceWith(h2);
                            // Link the heading to the card for accessibility
                            card.setAttribute('aria-labelledby', `card-title-${index}`);
                        }
                    } else {
                        p.classList.add('img-card-description');
                    }
                });
            }

            // Add keyboard interaction
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Announce card content to screen readers
            card.addEventListener('focus', () => {
                const title = card.querySelector(options.titleSelector);
                const description = card.querySelector(options.descriptionSelector);
                if (title && description) {
                    const announcement = `${title.textContent}. ${description.textContent}`;
                    const liveRegion = document.createElement('div');
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.style.position = 'absolute';
                    liveRegion.style.clip = 'rect(0 0 0 0)';
                    document.body.appendChild(liveRegion);
                    setTimeout(() => {
                        liveRegion.textContent = announcement;
                        setTimeout(() => liveRegion.remove(), 1000);
                    }, 100);
                }
            });

        } catch (error) {
            console.error(`Error decorating card ${index}:`, error);
        }
    });

    // Add intersection observer for performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!prefersReducedMotion) {
                        entry.target.classList.add('img-card--visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: options.observerRootMargin
        });

        cards.forEach(card => observer.observe(card));
    }

    // Analytics tracking (if available)
    if (window.analytics) {
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector(options.titleSelector)?.textContent;
                window.analytics.track('Card Click', {
                    title,
                    blockType: 'img-cards'
                });
            });
        });
    }
} 
