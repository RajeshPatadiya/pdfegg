import { Color, rgb } from "pdf-lib";

export function hexToPdfColor(hexColor: string): Color {
  if (hexColor[0] === "#") {
    hexColor = hexColor.slice(1);
  }
  if (hexColor.length != 6) {
    throw Error("Invalid hex color format: " + hexColor);
  }

  const bigint = parseInt(hexColor, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return rgb(r / 255, g / 255, b / 255);
}
