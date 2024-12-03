export default async function decorate(block) {
  console.log(block);

  // Select the container with the quote blocks
  const quoteContainer = document.querySelectorAll(".quote-container")[0];

  // Find all anchor tags within the container
  const anchors = quoteContainer.querySelectorAll("a");

  // Iterate through each anchor tag
  anchors.forEach((anchor) => {
    // Get the video URL from the href attribute
    const videoUrl = anchor.href;

    // Check if the URL is a YouTube link
    if (videoUrl.includes("youtu")) {
      // Create a <video> element
      const videoElement = document.createElement("video");
      videoElement.setAttribute("controls", "true");
      videoElement.setAttribute("width", "640"); // Adjust as needed
      videoElement.setAttribute("height", "360"); // Adjust as needed

      // Convert the YouTube URL to an embeddable URL (if necessary)
      const videoId =
        new URL(videoUrl).searchParams.get("v") || videoUrl.split("/").pop();
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      // Set the video source
      videoElement.innerHTML = `<source src="${embedUrl}" type="video/mp4">`;

      // Replace the parent <p> tag with the <video> element
      const parentParagraph = anchor.closest("p");
      if (parentParagraph) {
        parentParagraph.replaceWith(videoElement);
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
