export const MOCK_CONTENT = {
    columns: `
        <div class="section columns-container" data-section-status="loaded">
          <div class="default-content-wrapper">
            <h1>Latest Job Openings</h1>
          </div>
          <div class="columns-wrapper">
            <div class="columns block columns-4-cols" data-block-name="columns" data-block-status="loaded">
              <!-- Job 1 -->
              <div class="column-item" data-posted="1 days ago" data-applied="32" data-capacity="50">
                <div>
                  <img src="/content/dam/company-logo1.png" alt="Company 1">
                  <h2>Frontend Developer</h2>
                </div>
              </div>
              <!-- Job 2 -->
              <div class="column-item" data-posted="2 days ago" data-applied="45" data-capacity="60">
                <div>
                  <img src="/content/dam/company-logo2.png" alt="Company 2">
                  <h2>UX Designer</h2>
                </div>
              </div>
              <!-- Add more jobs as needed -->
            </div>
          </div>
        </div>
      `,
    // Add other block mock content
  };
  
  export function loadMockContent(blockName) {
    return MOCK_CONTENT[blockName] || '';
  }