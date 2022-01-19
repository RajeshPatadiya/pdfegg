import { Coord, Size } from "./Measure";

export type Box = Coord & Size;

export function boxRight(box: Box): number {
  return box.x + box.width;
}

export function boxBottom(box: Box): number {
  return box.y + box.height;
}

// Scales the box's coordinate system.
export function boxScaleCoord(box: Box, scalar: number): Box {
  return {
    x: box.x * scalar,
    y: box.y * scalar,
    width: box.width * scalar,
    height: box.height * scalar,
  };
}

export function boxIntersection(boxA: Box, boxB: Box): Box | null {
  console.assert(boxA.width >= 0 && boxA.height >= 0);
  console.assert(boxB.width >= 0 && boxB.height >= 0);

  const x = Math.max(boxA.x, boxB.x);
  const y = Math.max(boxA.y, boxB.y);

  const intersectionRight = Math.min(boxRight(boxA), boxRight(boxB));
  const intersectionBottom = Math.min(boxBottom(boxA), boxBottom(boxB));

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
