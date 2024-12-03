import { createOptimizedPicture } from "../../scripts/aem.js";
import { moveInstrumentation } from "../../scripts/scripts.js";

export default function decorate(block) {
  console.log(block);
  // Get the container div
  const container = document.querySelector(".cards.block");

  // Create a new <ul> element
  const ulElement = document.createElement("ul");

  // Loop through the children of the container
  Array.from(container.children).forEach((card) => {
    // Create a new <li> element
    const liElement = document.createElement("li");

    // Extract the picture element
    const picture = card.querySelector("picture");
    if (picture) {
      liElement.appendChild(picture.cloneNode(true));
    }

    // Extract the content
    const content = card.querySelector("div:nth-child(2)");
    if (content) {
      liElement.appendChild(content.cloneNode(true));
    }

    // Append the <li> to the <ul>
    ulElement.appendChild(liElement);
  });

  // Replace the container's content with the new <ul>
  container.innerHTML = "";
  container.appendChild(ulElement);

  /* change to ul, li */
  // const ul = document.createElement('ul');
  // [...block.children].forEach((row) => {
  //   const li = document.createElement('li');
  //   moveInstrumentation(row, li);
  //   while (row.firstElementChild) li.append(row.firstElementChild);
  //   [...li.children].forEach((div) => {
  //     if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
  //     else div.className = 'cards-card-body';
  //   });
  //   ul.append(li);
  // });
  // ul.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
  // block.textContent = '';
  // block.append(ul);
}
