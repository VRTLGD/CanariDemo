// countsSampleModel.js (optional)
export function createCountsSample({
  blockID = "",
  row = "",
  variety = "",
  tree = "",
  canopyType = "",
  totalFruit = 0,
  vigor = "",
} = {}) {
  return {
    id: crypto.randomUUID(),
    blockID,
    row,
    variety,
    tree,
    canopyType,
    totalFruit,
    vigor,
  };
}
