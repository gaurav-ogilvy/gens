export default async function decorate(block) {

    // Select the target <p> element where the iframe should be appended
    const targetParagraph = document.querySelector('.quote-wrapper .quote.block div:nth-child(2) div p');
    
    // Create the iframe element
    const iframe = document.createElement('iframe');
    
    // Set iframe attributes
    iframe.src = "https://gentingsingapore.com/#!/en/investors/stock-information/share-quote-and-chart"; // Replace with your desired URL
    iframe.width = "100%";
    iframe.height = "1600";
    iframe.style.border = "1px solid #ccc";
    
    // Append the iframe to the <p> element
    targetParagraph.appendChild(iframe);
}