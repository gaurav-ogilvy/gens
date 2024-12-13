/**
 * Configuration options for the img-cards block
 * @type {Object}
 */
const DEFAULT_CONFIG = {
    lazyLoadThreshold: 2,
    animationDuration: '0.3s',
    observerRootMargin: '50px',
    cardSelector: '.img-card',
    titleSelector: '.img-card-title',
    descriptionSelector: '.img-card-description',
    ctaText: 'Learn more',
    loadingText: 'Loading image...'
};

/**
 * Handles image loading errors
 * @param {HTMLImageElement} img - The image element that failed to load
 */
function handleImageError(img) {
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" alignment-baseline="middle" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
    img.alt = 'Image failed to load';
    img.closest('.img-card')?.setAttribute('aria-busy', 'false');
    console.warn('Image failed to load:', img.src);
}

/**
 * Creates a learn more button element
 * @param {string} text - The button text
 * @returns {HTMLAnchorElement}
 */
function createLearnMoreButton(text) {
    const button = document.createElement('a');
    button.href = '#';
    button.className = 'img-card-cta';
    button.textContent = text;
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', text);
    button.setAttribute('aria-expanded', 'false');
    return button;
}

/**
 * Creates a loading indicator element
 * @param {string} text - The loading text
 * @returns {HTMLDivElement}
 */
function createLoadingIndicator(text) {
    const loading = document.createElement('div');
    loading.className = 'img-card-loading';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-live', 'polite');
    loading.textContent = text;
    return loading;
}

/**
 * Handles image loading state
 * @param {HTMLImageElement} img - The image element
 * @param {HTMLElement} card - The card element
 */
function handleImageLoading(img, card) {
    const loading = createLoadingIndicator(DEFAULT_CONFIG.loadingText);
    card.appendChild(loading);
    card.setAttribute('aria-busy', 'true');

    img.addEventListener('load', () => {
        loading.remove();
        card.setAttribute('aria-busy', 'false');
    });

    img.addEventListener('error', () => {
        loading.remove();
        handleImageError(img);
    });
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

    // Add reduced motion check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Convert direct div children to card elements
    const cards = [...block.children];
    cards.forEach((card, index) => {
        try {
            // Add classes and make card focusable
            card.classList.add('img-card');
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Card ${index + 1} of ${cards.length}`);
            card.setAttribute('aria-expanded', 'false');

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
                        // Add loading state handling
                        handleImageLoading(img, card);
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

                // Add learn more button
                const learnMoreButton = createLearnMoreButton(options.ctaText);
                contentDiv.appendChild(learnMoreButton);

                // Add interaction handling
                learnMoreButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const expanded = learnMoreButton.getAttribute('aria-expanded') === 'true';
                    learnMoreButton.setAttribute('aria-expanded', (!expanded).toString());
                    card.setAttribute('aria-expanded', (!expanded).toString());
                });
            }

            // Add keyboard interaction
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const cta = card.querySelector('.img-card-cta');
                    if (cta) cta.click();
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
