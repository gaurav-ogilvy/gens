/**
 * Decorates job listing columns with accessibility and interactive features
 * @param {HTMLElement} block The column block element
 */
export default function decorateColumns(block) {
  const columns = [...block.children];
  
  // Add ARIA attributes to the container
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Job Listings');
  
  // Add appropriate classes
  block.classList.add(`columns-${columns.length}-cols`);

  columns.forEach((column, index) => {
    // Add accessibility attributes
    column.setAttribute('role', 'article');
    column.setAttribute('aria-label', `Job ${index + 1}`);
    column.classList.add('job-card');
    
    // Extract data from column
    const image = column.querySelector('img');
    const title = column.querySelector('h2');
    const postedDate = column.getAttribute('data-posted') || '1 days ago';
    const appliedCount = parseInt(column.getAttribute('data-applied') || '32', 10);
    const capacity = parseInt(column.getAttribute('data-capacity') || '50', 10);
    
    // Calculate progress percentage safely
    const progressPercentage = Math.min(Math.max((appliedCount / capacity) * 100, 0), 100);
    
    // Create accessible progress indicator
    const progressId = `progress-${Math.random().toString(36).substr(2, 9)}`;
    
    // Structure the content with semantic HTML and ARIA attributes
    column.innerHTML = `
      <div class="job-card-header">
        <div class="company-logo" role="img" aria-label="Company Logo">
          ${image?.outerHTML || ''}
        </div>
        <div class="job-meta">
          <div class="company-name">${title?.textContent || ''}</div>
          <div class="post-date" aria-label="Posted ${postedDate}">${postedDate}</div>
        </div>
      </div>
      <div class="job-card-body">
        <h3 class="job-title">${title?.textContent || ''}</h3>
        <div class="job-details">
          <div class="job-location" aria-label="Location: Singapore">Singapore</div>
          <div class="job-type" aria-label="Job Type: Design">Design</div>
        </div>
      </div>
      <div class="job-card-footer">
        <div class="application-stats" 
             role="status" 
             aria-live="polite"
             aria-label="Application Status">
          <span class="applied-count">${appliedCount}</span> Applied
          <span class="capacity">of ${capacity} capacity</span>
        </div>
        <div class="progress-bar" 
             role="progressbar" 
             id="${progressId}"
             aria-valuemin="0" 
             aria-valuemax="100" 
             aria-valuenow="${progressPercentage}"
             aria-label="Application Progress">
          <div class="progress" style="width: ${progressPercentage}%"></div>
        </div>
      </div>
    `;

    // Add interactive features
    column.addEventListener('click', () => {
      // Handle card click - could navigate to job details
      window.location.href = column.querySelector('a')?.href || '#';
    });

    // Add keyboard navigation
    column.setAttribute('tabindex', '0');
    column.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        column.click();
      }
    });

    // Add hover state announcements for screen readers
    column.addEventListener('mouseenter', () => {
      column.setAttribute('aria-expanded', 'true');
    });

    column.addEventListener('mouseleave', () => {
      column.setAttribute('aria-expanded', 'false');
    });
  });

  // Add responsive behavior observer
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = entry.contentRect.width;
      const columns = entry.target;
      
      // Adjust columns based on container width
      if (width < 600) {
        columns.classList.remove('columns-4-cols', 'columns-3-cols', 'columns-2-cols');
        columns.classList.add('columns-1-col');
      } else if (width < 900) {
        columns.classList.remove('columns-4-cols', 'columns-3-cols', 'columns-1-col');
        columns.classList.add('columns-2-cols');
      } else if (width < 1200) {
        columns.classList.remove('columns-4-cols', 'columns-2-cols', 'columns-1-col');
        columns.classList.add('columns-3-cols');
      } else {
        columns.classList.remove('columns-3-cols', 'columns-2-cols', 'columns-1-col');
        columns.classList.add('columns-4-cols');
      }
    }
  });

  resizeObserver.observe(block);
}
