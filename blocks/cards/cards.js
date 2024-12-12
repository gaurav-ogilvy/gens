/**
 * Configuration options for the black-img-cards block
 * @type {Object}
 */
const DEFAULT_CONFIG = {
    lazyLoadThreshold: 2,
    observerRootMargin: '50px',
    overlayOpacity: 0.7,
    textColor: '#ffffff',
    buttonText: 'Learn more',
    animationDuration: '0.3s'
};

/**
 * Creates a gradient overlay for the image
 * @param {HTMLElement} imageContainer - The container element
 */
function createOverlay(imageContainer) {
    const overlay = document.createElement('div');
    overlay.classList.add('black-img-card-overlay');
    imageContainer.appendChild(overlay);
}

/**
 * Creates a button element with proper attributes
 * @param {string} text - Button text
 * @param {string} ariaLabel - Accessibility label
 * @returns {HTMLElement} - The button element
 */
function createButton(text, ariaLabel) {
    const button = document.createElement('button');
    button.classList.add('black-img-card-button');
    button.textContent = text;
    button.setAttribute('aria-label', ariaLabel);
    return button;
}

/**
 * Decorates the black-img-cards block
 * @param {HTMLElement} block - The block element to decorate
 * @param {Object} [config] - Optional configuration object
 */
export default function decorate(block, config = {}) {
    const options = { ...DEFAULT_CONFIG, ...config };

    // Add classes and ARIA attributes
    block.classList.add('black-img-cards-container');
    block.setAttribute('role', 'region');
    block.setAttribute('aria-label', 'Feature Cards');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Process each card
    const cards = [...block.children];
    cards.forEach((card, index) => {
        try {
            // Add classes and make card focusable
            card.classList.add('black-img-card');
            card.setAttribute('role', 'article');

            // Get the image and content divs
            const [imageDiv, contentDiv] = card.children;

            // Handle image container
            if (imageDiv) {
                imageDiv.classList.add('black-img-card-image');
                createOverlay(imageDiv);

                const picture = imageDiv.querySelector('picture');
                if (picture) {
                    picture.classList.add('black-img-card-picture');
                    const img = picture.querySelector('img');
                    if (img) {
                        // Add lazy loading for images below the threshold
                        if (index >= options.lazyLoadThreshold) {
                            img.setAttribute('loading', 'lazy');
                        }
                        img.setAttribute('decoding', 'async');

                        // Ensure proper alt text
                        if (!img.hasAttribute('alt')) {
                            const title = contentDiv?.querySelector('strong')?.textContent || '';
                            img.setAttribute('alt', `Background image for ${title}`);
                        }
                    }
                }
            }

            // Handle content container
            if (contentDiv) {
                contentDiv.classList.add('black-img-card-content');

                // Process text content
                const paragraphs = contentDiv.querySelectorAll('p');
                paragraphs.forEach((p, pIndex) => {
                    if (pIndex === 0) {
                        const strong = p.querySelector('strong');
                        if (strong) {
                            const h2 = document.createElement('h2');
                            h2.className = 'black-img-card-title';
                            h2.textContent = strong.textContent;
                            p.replaceWith(h2);
                        }
                    } else {
                        p.classList.add('black-img-card-description');
                    }
                });

                // Add learn more button
                const button = createButton(
                    options.buttonText,
                    `${options.buttonText} about ${contentDiv.querySelector('h2')?.textContent || ''}`
                );
                contentDiv.appendChild(button);
            }

            // Add intersection observer for animation
            if (!prefersReducedMotion && 'IntersectionObserver' in window) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('black-img-card--visible');
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { rootMargin: options.observerRootMargin }
                );
                observer.observe(card);
            }

            // Add click handler for the entire card
            card.addEventListener('click', (e) => {
                if (e.target.closest('.black-img-card-button')) {
                    // Handle button click
                    const title = card.querySelector('.black-img-card-title')?.textContent;
                    console.log(`Clicked learn more for: ${title}`);
                    // You can add custom navigation or action here
                }
            });

            // Add keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.querySelector('.black-img-card-button')?.click();
                }
            });

        } catch (error) {
            console.error(`Error decorating card ${index}:`, error);
        }
    });
} 
