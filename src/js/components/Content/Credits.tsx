import React, { ReactElement, Fragment } from 'react';

export default (): ReactElement => (
  <Fragment>
    <div className="credits-wrapper">
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
    </div>
  </Fragment>
);
