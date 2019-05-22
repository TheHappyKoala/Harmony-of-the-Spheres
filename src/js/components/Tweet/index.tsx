import React, { ReactElement } from 'react';

interface TweetProps {
  shareText: string;
  shareUrl: string;
  callToAction: string;
  cssClassName: string;
  hashtags: string;
}

export default ({
  shareText,
  shareUrl,
  callToAction,
  cssClassName,
  hashtags
}: TweetProps): ReactElement => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`https://twitter.com/intent/tweet/?text=${encodeURI(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`}
    className={cssClassName}
  >
    <span>{callToAction}</span>
  </a>
);
