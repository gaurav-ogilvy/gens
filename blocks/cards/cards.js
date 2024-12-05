import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createCarouselControls() {
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-control prev';
  prevButton.innerHTML = '&#8592;'; // Left arrow
  prevButton.setAttribute('aria-label', 'Previous slide');
  
  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-control next';
  nextButton.innerHTML = '&#8594;'; // Right arrow
  nextButton.setAttribute('aria-label', 'Next slide');
  
  controls.appendChild(prevButton);
  controls.appendChild(nextButton);
  
  return controls;
}

function initializeCarousel(carousel) {
  const ul = carousel.querySelector('ul');
  const slides = carousel.querySelectorAll('li');
  const controls = carousel.querySelector('.carousel-controls');
  const prevButton = controls.querySelector('.prev');
  const nextButton = controls.querySelector('.next');
  
  let currentSlide = 0;
  const slideCount = slides.length;
  
  function updateSlidePosition() {
    ul.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot indicator
    const dots = carousel.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    currentSlide = (index + slideCount) % slideCount;
    updateSlidePosition();
  }
  
  prevButton.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextButton.addEventListener('click', () => goToSlide(currentSlide + 1));
  
  // Add dot indicators
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  carousel.appendChild(dotsContainer);
  
  // Initialize first slide
  updateSlidePosition();
  
  // Optional: Auto-play
  let autoplayInterval;
  
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000); // Change slide every 5 seconds
  }
  
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }
  
  // Start autoplay and handle hover pause
  startAutoplay();
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
}

export default function decorate(block) {
  // Create carousel container
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'carousel-container';
  
  // Create slides list
  const ul = document.createElement('ul');
  ul.className = 'carousel-slides';
  
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'carousel-slide';
    moveInstrumentation(row, li);
    
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    
    ul.append(li);
  });
  
  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  
  // Add carousel controls
  const controls = createCarouselControls();
  
  // Assemble carousel
  carouselContainer.appendChild(ul);
  carouselContainer.appendChild(controls);
  
  // Replace block content
  block.textContent = '';
  block.appendChild(carouselContainer);
  
  // Initialize carousel
  initializeCarousel(carouselContainer);
}
