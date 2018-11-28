import React from 'react';

export default function() {
  return (
    <div>
      <h1>Credits</h1>
      <p className="modal-item">
        <b>&#187; </b>Programming by{' '}
        <a href="https://github.com/TheHappyKoala/" target="blank">
          Darrell A. Huffman (The Happy Koala)
        </a>{' '}
        .
      </p>
      <p className="modal-item">
        <b>&#187; </b>
        <a
          href="http://www.feynmanlectures.caltech.edu/I_toc.html"
          target="blank"
        >
          Volume One of the Feynman Lectures on Physics
        </a>{' '}
        helped me wrap my head around the gravitational n-body problem and
        Newtonian mechanics.
      </p>
      <p className="modal-item">
        <b>&#187; </b>
        <a href="https://nasa3d.arc.nasa.gov/models" target="blank">
          Spacecraft 3D models
        </a>{' '}
        curtsey of NASA.
      </p>
      <p className="modal-item">
        <b>&#187; </b>
        <a href="http://planetpixelemporium.com/" target="blank">
          Planet textures
        </a>{' '}
        curtsey of James Hastings-Trew.
      </p>
      <p className="modal-item">
        <b>&#187; </b>
        State Vectors for solar system bodies were obtained from{' '}
        <a href="https://ssd.jpl.nasa.gov/horizons.cgi" target="blank">
          NASA JPL
        </a>.
      </p>
      <p className="modal-item">
        <b>&#187; </b>
        The kind folks at{' '}
        <a href="https://space.stackexchange.com/" target="blank">
          space.stackexchange.com
        </a>{' '}
        for kindly providing answers and feedback that helped me in the
        development of this application.
      </p>
      <p className="modal-item">
        <b>&#187; </b>
        Last, but not least, I would like to credit the Universe for being
        awesomely weird and thought provoking!
      </p>
    </div>
  );
}
