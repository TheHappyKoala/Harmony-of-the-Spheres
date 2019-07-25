import React, { ReactElement, Fragment } from 'react';

export default (): ReactElement => (
  <Fragment>
    <div className="credits-wrapper">
      <h2 className="credits-title">Project Contributors</h2>
      <section className="contributors">
        <article>
          <div className="contributor-avatar">
            <img src="./images/darrell.jpg" width={150} />
          </div>
          <section className="contributor-details">
            <h3>Darrell A. Huffman</h3>
            <p className="italic">Maintainer and Developer</p>
            <p className="contributor-description">
              Environmental economist and software developer with a strong
              interest in science. Has no clue what he is doing.{' '}
              <a href="https://thehappykoala.github.io/" target="blank">
                Learn More
              </a>
            </p>
          </section>
        </article>
        <article>
          <div className="contributor-avatar">
            <img src="./images/hugo.jpg" width={150} />
          </div>
          <section className="contributor-details">
            <h3>Hugo Granström</h3>
            <p className="italic">Collaborator and Developer</p>
            <p className="contributor-description">
              Swedish science and programming enthusiast. Studying Engineering
              Physics.{' '}
              <a href="https://hugogranstrom.com/" target="blank">
                Learn More
              </a>
            </p>
          </section>
        </article>
        <article>
          <div className="contributor-avatar">
            <img src="./images/prisoner849.gif" width={150} />
          </div>
          <section className="contributor-details">
            <h3>Paul West</h3>
            <p className="italic">Developer</p>
            <p className="contributor-description">
              Possibly the most helpful and gracious fellow in the WebGL
              community.{' '}
              <a
                href="https://discourse.threejs.org/u/prisoner849/summary"
                target="blank"
              >
                Learn More
              </a>
            </p>
          </section>
        </article>
        <article className="contributor-entry">
          <div className="contributor-avatar">
            <img src="./images/john.png" width={150} />
          </div>
          <section className="contributor-details">
            <h3>John Van Vliet</h3>
            <p className="italic">Planet and Moon Textures</p>
            <p className="contributor-description">
              Makes maps of planets and moons, along with minor bodies and
              asteroids.{' '}
              <a href="https://github.com/JohnVV" target="blank">
                Learn More
              </a>
            </p>
          </section>
        </article>
      </section>
      <h2 className="credits-title">Resources</h2>
      <div className="credits-resources">
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          <a href="https://nasa3d.arc.nasa.gov/models" target="blank">
            Spacecraft 3D models
          </a>{' '}
          courtesy of NASA.
        </p>
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          Asteroid and comet models courtesy of the{' '}
          <a href="https://space.frieger.com/asteroids/" target="blank">
            3D Asteroid Catalogue
          </a>, which is maintained by Greg Frieger.
        </p>
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          State Vectors for solar system bodies were obtained from{' '}
          <a href="https://ssd.jpl.nasa.gov/horizons.cgi" target="blank">
            NASA JPL
          </a>.
        </p>
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          Exoplanet data courtesy of the{' '}
          <a href="https://exoplanetarchive.ipac.caltech.edu/" target="blank">
            NASA Exoplanet Archive
          </a>, which is operated by the California Institute of Technology,
          under contract with the National Aeronautics and Space Administration
          under the Exoplanet Exploration Program.
        </p>
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          The kind folks at{' '}
          <a href="https://space.stackexchange.com/" target="blank">
            space.stackexchange.com
          </a>{' '}
          and{' '}
          <a href="https://scicomp.stackexchange.com/" target="blank">
            scicomp.stackexchange.com
          </a>{' '}
          for kindly providing answers and feedback that helped with the
          development of this application.
        </p>
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          <a href="https://wikipedia.com/" target="blank">
            WikiPedia
          </a>{' '}
          and all the awesome people that contribute to it with content and the
          financial resources that keep it up and running.
        </p>
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          Mr. Doob and all the other people that created the{' '}
          <a href="https://threejs.org/" target="blank">
            THREE.js WebGL library
          </a>.
        </p>
        <p className="credits-item">
          <i className="fas fa-rocket fa-2x" />
          Last, but not least, the Universe ought to receive some credit for
          being awesomely weird and thought provoking!
        </p>
      </div>
    </div>
  </Fragment>
);
