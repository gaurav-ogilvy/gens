export default function decorateColumns(block) {
  const columns = [...block.children];
  block.classList.add(`columns-${columns.length}-cols`);

  columns.forEach((column) => {
    column.classList.add('column-item');
  });
}
