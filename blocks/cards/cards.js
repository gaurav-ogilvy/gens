/**
 * Decorates the cards block.
 * @param {Element} block The cards block element
 */
export default function decorateCards(block) {
    // Add container class
    block.classList.add('img-cards-container');

    // Process each card
    block.querySelectorAll(':scope > div').forEach((card, index) => {
        // Add card class
        card.classList.add('img-card');
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');

        // Structure card content
        const [imageWrapper, contentWrapper] = card.children;
        imageWrapper.classList.add('img-card-image');
        contentWrapper.classList.add('img-card-content');

        // Add proper heading and paragraph classes
        const title = contentWrapper.querySelector('strong').parentElement;
        const description = contentWrapper.querySelector('p:not(:first-child)');

        title.classList.add('img-card-title');
        description.classList.add('img-card-description');

        // Handle image loading
        const picture = imageWrapper.querySelector('picture');
        const img = picture.querySelector('img');

        if (img) {
            card.setAttribute('aria-busy', 'true');

            // Add loading indicator
            const loadingText = document.createElement('div');
            loadingText.classList.add('img-card-loading');
            loadingText.textContent = 'Loading...';
            card.appendChild(loadingText);

            // Handle image load
            const handleImageLoad = () => {
                card.removeAttribute('aria-busy');
                loadingText.remove();
                card.classList.add('img-card--visible');
            };

            if (img.complete) {
                handleImageLoad();
            } else {
                img.addEventListener('load', handleImageLoad);
            }

            // Handle image error
            img.addEventListener('error', () => {
                card.removeAttribute('aria-busy');
                loadingText.textContent = 'Image failed to load';
            });
        }

        // Add animation delay based on index
        card.style.transitionDelay = `${index * 100}ms`;
    });

    // Intersection Observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('img-card--visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe each card
    block.querySelectorAll('.img-card').forEach((card) => {
        observer.observe(card);
    });

    // Keyboard navigation
    block.addEventListener('keydown', (e) => {
        const card = e.target.closest('.img-card');
        if (!card) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
} 
