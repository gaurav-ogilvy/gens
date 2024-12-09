export default function decorateColumns(block) {
  const columns = [...block.children];
  block.classList.add(`columns-${columns.length}-cols`);

  columns.forEach((column) => {
    column.classList.add('job-card');
    
    // Structure the content
    const content = column.innerHTML;
    column.innerHTML = `
      <div class="job-card-header">
        <div class="company-logo">
          ${column.querySelector('img')?.outerHTML || ''}
        </div>
        <div class="job-meta">
          <div class="company-name">${column.querySelector('h2')?.textContent || ''}</div>
          <div class="post-date">${column.getAttribute('data-posted') || '1 days ago'}</div>
        </div>
      </div>
      <div class="job-card-body">
        <h3 class="job-title">${column.querySelector('h2')?.textContent || ''}</h3>
        <div class="job-location">Singapore</div>
        <div class="job-type">Design</div>
      </div>
      <div class="job-card-footer">
        <div class="application-stats">
          <span class="applied-count">${column.getAttribute('data-applied') || '32'}</span> Applied
          <span class="capacity">of ${column.getAttribute('data-capacity') || '50'} capacity</span>
        </div>
        <div class="progress-bar">
          <div class="progress" style="width: ${(32/50)*100}%"></div>
        </div>
      </div>
    `;
  });
}
