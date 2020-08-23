import React, { ReactElement, useState } from "react";
import "./LazyDog.less";

interface LazyDogProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
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
    <div className="lazy-dog-wrapper">
      <img
        onLoad={() => setLoading(false)}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={!loading && "loaded-image"}
        style={{ width: !width && "100%" }}
      />
      <p>{caption}</p>
      {loading && <i className={placeHolderIcon} />}
    </div>
  );
};
