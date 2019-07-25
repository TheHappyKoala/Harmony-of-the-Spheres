import React, { ReactElement, memo } from 'react';

interface TweetProps {
  shareText: string;
  shareUrl: string;
  callToAction: string;
  cssClassName: string;
  hashtags: string;
}

export default memo(
  ({
    shareText,
    shareUrl,
    callToAction,
    cssClassName,
    hashtags
  }: TweetProps): ReactElement => (
    <div className={cssClassName}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://twitter.com/intent/tweet/?text=${encodeURI(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`}
      >
        <span>
          <i className="fa fa-twitter fa-2x" />
          {callToAction}
        </span>
      </a>
    </div>
  ),
  (prevProps, nextProps) => prevProps.shareUrl === nextProps.shareUrl
);
