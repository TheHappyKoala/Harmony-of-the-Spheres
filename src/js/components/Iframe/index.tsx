import React, { ReactElement, useState } from 'react';
import './Iframe.less';

interface IframeProps {
  url: string;
  iframeCustomCssClass?: string;
}

export default ({ url, iframeCustomCssClass }: IframeProps): ReactElement => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`iframe-scroll-wrapper ${iframeCustomCssClass}`}>
      <iframe
        src={url}
        onLoad={() => setLoading(false)}
        frameBorder="0"
        style={{ display: loading ? 'none' : 'block' }}
      />
      {loading && (
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      )}
    </div>
  );
};
