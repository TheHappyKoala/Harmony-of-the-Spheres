import React, { memo } from 'react';
export default memo(({ shareText, shareUrl, callToAction, cssClassName, hashtags }) => (React.createElement("a", { target: "_blank", rel: "noopener noreferrer", href: `https://twitter.com/intent/tweet/?text=${encodeURI(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`, className: cssClassName },
    React.createElement("span", null, callToAction))), (prevProps, nextProps) => prevProps.shareUrl === nextProps.shareUrl);
//# sourceMappingURL=index.js.map