export default async function decorate(block) {
  console.log(block);

  // Select the container with the quote blocks
  const quoteContainer = document.querySelectorAll(".quote-container")[1];

  // Find all anchor tags within the container
  const anchors = quoteContainer.querySelectorAll("a");

  // Iterate through each anchor tag
  anchors.forEach(anchor => {
    // Get the video URL from the href attribute
    const videoUrl = anchor.href;

    // Check if the URL is a YouTube link
    if (videoUrl.includes('youtu')) {
        // Extract the YouTube video ID
        const videoId = new URL(videoUrl).searchParams.get('v') || videoUrl.split('/').pop();

        // Create an embeddable YouTube URL
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        // Create an <iframe> element
        const iframe = document.createElement('iframe');
        iframe.setAttribute('width', '640'); // Adjust width as needed
        iframe.setAttribute('height', '360'); // Adjust height as needed
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', 'true');

        // Replace the parent <p> tag with the <iframe>
        const parentParagraph = anchor.closest('p');
        if (parentParagraph) {
            parentParagraph.replaceWith(iframe);
        }
    }
});


  // // Select the target <p> element where the iframe should be appended
  // const targetParagraph = document.querySelector('.quote-wrapper .quote.block div:nth-child(2) div p');

  // // Create the iframe element
  // const iframe = document.createElement('iframe');

  // // Set iframe attributes
  // iframe.src = "https://gentingsingapore.com/#!/en/contact"; // Replace with your desired URL
  // iframe.width = "100%";
  // iframe.height = "1600";
  // iframe.style.border = "1px solid #ccc";

  // // Append the iframe to the <p> element
  // targetParagraph.appendChild(iframe);
}
