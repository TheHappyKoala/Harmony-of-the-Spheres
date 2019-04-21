import React, { useState } from 'react';
import './LazyDog.less';

export default props => {
  const [loading, setLoading] = useState(true);

  return (
    <figure className="lazy-dog-wrapper">
      <img
        onLoad={() => setLoading(false)}
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        className={!loading && 'loaded-image'}
      />
      <figcaption>{props.caption}</figcaption>
      {loading && <i className={props.placeHolderIcon} />}
    </figure>
  );
};
        