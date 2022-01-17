export type Coord = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export function sizeAspectRatio(size: Size): number {
  return size.width / size.height;
}
