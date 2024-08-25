import { convertRemToPx } from "./text-utils";

const getRendererDimensions = (selectedTabIndex: number) => {
  const footerHeightRem = 6;
  const footerHeightPx = convertRemToPx(footerHeightRem);

  const windowWidthPx = window.innerWidth;
  const windowHeightPx = window.innerHeight;

  let rendererWidthPx = 0;
  let rendererHeightPx = 0;

  if (windowWidthPx < 500) {
    rendererHeightPx =
      windowHeightPx - (footerHeightPx + 0.45 * windowHeightPx);
    rendererWidthPx = windowWidthPx;
  } else if (windowWidthPx < 900) {
    const controlsContentWrapperWidthRem = 20;

    rendererHeightPx = windowHeightPx - footerHeightPx;
    rendererWidthPx =
      windowWidthPx - convertRemToPx(controlsContentWrapperWidthRem);
  } else {
    const controlsContentWrapperWidthRem = 40;

    rendererHeightPx = windowHeightPx - footerHeightPx;
    rendererWidthPx =
      windowWidthPx - convertRemToPx(controlsContentWrapperWidthRem);
  }

  if (selectedTabIndex === -1) {
    rendererHeightPx = windowHeightPx - footerHeightPx;
    rendererWidthPx = windowWidthPx;
  }

  return [rendererWidthPx, rendererHeightPx];
};

export { getRendererDimensions };
