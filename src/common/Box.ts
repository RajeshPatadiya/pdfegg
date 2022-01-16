export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function right(box: Box): number {
  return box.x + box.width;
}

function bottom(box: Box): number {
  return box.y + box.height;
}

export function boxIntersection(boxA: Box, boxB: Box): Box | null {
  console.assert(boxA.width >= 0 && boxA.height >= 0);
  console.assert(boxB.width >= 0 && boxB.height >= 0);

  const x = Math.max(boxA.x, boxB.x);
  const y = Math.max(boxA.y, boxB.y);

  const intersectionRight = Math.min(right(boxA), right(boxB));
  const intersectionBottom = Math.min(bottom(boxA), bottom(boxB));

  const width = intersectionRight - x;
  const height = intersectionBottom - y;

  if (width < 0 || height < 0) return null;

  return {
    x,
    y,
    width,
    height,
  };
}
