import React, { ReactElement, useState } from 'react';
import './LazyDog.less';

interface LazyDogProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  placeHolderIcon: string;
}

export default ({
  src,
  alt,
  width,
  height,
  caption,
  placeHolderIcon
}: LazyDogProps): ReactElement => {
  const [loading, setLoading] = useState(true);

  return (
    <figure className="lazy-dog-wrapper">
      <img
        onLoad={() => setLoading(false)}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={!loading && 'loaded-image'}
      />
      <figcaption>{caption}</figcaption>
      {loading && <i className={placeHolderIcon} />}
    </figure>
  );
};
