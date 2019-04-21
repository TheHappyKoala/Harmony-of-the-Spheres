import React, { useState } from 'react';
import './Iframe.less';

export default props => {
  const [loading, setLoading] = useState(true);
  return (
    <div className={`iframe-scroll-wrapper ${props.iframeCustomCssClass}`}>
      <iframe
        src={props.url}
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
