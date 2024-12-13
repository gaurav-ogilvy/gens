/**
 * Decorates the hero block
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
    // Add ARIA role for accessibility
    block.setAttribute('role', 'banner');
    block.setAttribute('aria-label', 'Hero Section');

    // Handle images
    const pictures = block.querySelectorAll('picture');
    pictures.forEach((picture) => {
        const img = picture.querySelector('img');
        if (img) {
            // Add lazy loading
            img.loading = 'lazy';

            // Add srcset for responsive images if not already present
            if (!img.srcset) {
                const src = img.src;
                const extension = src.substring(src.lastIndexOf('.'));
                const basePath = src.substring(0, src.lastIndexOf('.'));
                img.srcset = `${basePath}-600w${extension} 600w, ${basePath}-900w${extension} 900w, ${basePath}-1200w${extension} 1200w`;
                img.sizes = '(max-width: 600px) 600px, (max-width: 900px) 900px, 1200px';
            }

            // Ensure alt text is present
            if (!img.alt) {
                img.alt = 'Hero background image';
            }

            // Add fade-in animation when image loads
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.transition = 'opacity 0.5s ease-in-out';
                img.style.opacity = '1';
            });
        }
    });

    // Handle headings
    const headings = block.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
        // Add proper contrast and text shadow if needed
        const computedStyle = window.getComputedStyle(heading);
        const backgroundColor = computedStyle.backgroundColor;
        const textColor = computedStyle.color;

        // If background is light and text is dark (or vice versa), add text shadow
        if (isLightColor(backgroundColor) && isLightColor(textColor) ||
            isDarkColor(backgroundColor) && isDarkColor(textColor)) {
            heading.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        }
    });

    // Add keyboard navigation support
    const links = block.querySelectorAll('a');
    links.forEach((link) => {
        // Add focus styles
        link.addEventListener('focus', () => {
            link.style.outline = '2px solid var(--hero-text-color)';
            link.style.outlineOffset = '4px';
        });

        // Add ARIA label if not present
        if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', link.textContent || 'Hero section link');
        }
    });
}

/**
 * Helper function to determine if a color is light
 * @param {string} color The color to check
 * @returns {boolean} True if the color is light
 */
function isLightColor(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128;
}

/**
 * Helper function to determine if a color is dark
 * @param {string} color The color to check
 * @returns {boolean} True if the color is dark
 */
function isDarkColor(color) {
    return !isLightColor(color);
}
