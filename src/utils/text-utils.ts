export const kebabCase = (string: string): string =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

export const convertRemToPx = (rem: number) => {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );

  return rem * rootFontSize;
};
