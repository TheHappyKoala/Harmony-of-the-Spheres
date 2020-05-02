import React, { ReactElement, memo } from "react";

interface FacebookShareProps {
  shareUrl: string;
  callToAction?: string;
  cssClassName: string;
}

export default memo(
  ({
    shareUrl,
    callToAction,
    cssClassName
  }: FacebookShareProps): ReactElement => (
    <div className={cssClassName}>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <i className="fa fa-facebook" />
          {callToAction}
        </span>
      </a>
    </div>
  ),
  (prevProps, nextProps) => prevProps.shareUrl === nextProps.shareUrl
);
