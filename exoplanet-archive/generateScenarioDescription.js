module.exports = (scenario, habitableZoneBounds) => `
<h1>The ${scenario[0].pl_hostname} Exoplanetary System</h1>
<br/>
<h1>Overview</h1>
<p>${scenario[0].pl_hostname} is a star with ${
  scenario[0].st_mass
} times the mass of the Sun, and ${
  scenario[0].st_rad
} times its radius. It is located ${(scenario[0].st_dist * 3.26156).toFixed(
  2
)} light years away from the solar system${
  scenario[0].st_age !== null
    ? ` and is estimated to be ${scenario[0].st_age} billion years old, as compared to the Sun which is roughly 4.6 billion years old`
    : ""
}.</p>
<p>${scenario[0].pl_hostname} is known to have ${
  scenario[0].pl_pnum
} exoplanets in orbit around it.</p>

<br/>
  <h1>Exoplanets in the ${scenario[0].pl_hostname} system</h1>
  <br/>
  ${scenario
    .map(planet => {
      const masso = planet.pl_bmassj !== null ? planet.pl_bmassj * 318 : null;

      const mass =
        masso !== null
          ? `The mass of ${planet.pl_hostname} ${planet.pl_letter} is ${masso} times the mass of Earth.`
          : "";

      const radius =
        planet.pl_rade !== null
          ? `The radius of ${planet.pl_hostname} ${planet.pl_letter} is ${planet.pl_rade} that of Earth.`
          : "";

      const isRegularRockyPlanet =
        masso !== null && masso < 1.5
          ? `At less than 1.5 Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is a regular terrestrial planet, much like the terrestrial planets we find in our solar system, namely Mercury, Venus, Earth and Mars.`
          : "";

      const superEarth =
        masso !== null && masso > 1.5 && masso < 10
          ? `At ${masso} Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is a so called Super Earth. Super Earths could be terrestrial worlds like Earth, but they could also be ocean worlds or terrestrial worlds wrapped in a substantial atmosphere, in which case some refer to them as Mini Neptunes. No Super Earths are known to exist in our solar system, but if it exists, the so-called Planet Nine could very well be a super Earth, as it is hypothesized to have a mass between five and ten Earth masses.`
          : "";

      const iceGiant =
        masso !== null && masso > 10 && masso < 50
          ? `At more than 10 Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is an ice giant, a planet that is made up mostly of volatiles like water, amonia and methane, and enveloped by a dense hydrogen and helium atmosphere, much like Uranus and Neptune in our solar system.`
          : "";

      const gasGiant =
        masso !== null && masso > 50
          ? `At more than 50 Earth masses, ${planet.pl_hostname} ${planet.pl_letter} is a gas giant, a planet whose mass is mostly made up of hydrogen and helium, like Jupiter and Saturn in our solar system.`
          : "";

      const habitable =
        masso !== null &&
        habitableZoneBounds[0] < planet.pl_orbsmax &&
        habitableZoneBounds[1] > planet.pl_orbsmax &&
        masso < 10
          ? `With a mass of ${masso} Earth masses and a semi-major axis of ${planet.pl_orbsmax} astronomical units, ${planet.pl_hostname} ${planet.pl_letter} could, potentially, be a habitable planet with stable bodies of liquid water on its surface, like Earth.`
          : "";

      return `
      <h1>${planet.pl_hostname} ${planet.pl_letter}</h1>
      <p>${planet.pl_hostname} ${planet.pl_letter} was discovered by the ${
        planet.pl_facility
      } observatory using the ${planet.pl_discmethod.toLowerCase()} method. Its semi-major axis is ${planet.pl_orbsmax.toFixed(
        2
      )} astronomical units, as compared to Earth's which is 1 astronomical unit. ${mass} ${radius} ${isRegularRockyPlanet} ${superEarth} ${iceGiant} ${gasGiant} ${habitable}</p>
      <br/>
`;
    })
    .join(" ")}
`;
