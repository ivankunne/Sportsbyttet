/**
 * Returns "black" or "white" depending on which gives better contrast
 * against the given hex background color.
 */
export function contrastColor(hex: string | null | undefined): "black" | "white" {
  if (!hex) return "white";
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "white";
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  // Relative luminance (WCAG formula)
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.179 ? "black" : "white";
}
