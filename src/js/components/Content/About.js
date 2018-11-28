import React from 'react';

export default function() {
  return (
    <div>
      <h1>About</h1>
      <p className="modal-item">
        I have always had a strange fascination with the force of gravity. Not
        surprising, perhaps, when you take its ubiquitous nature into account.
        It is there for us to perceive and experience in our every day lives;
        when we climb stairs, move a stack of books or, God forbid, drop an egg
        on the floor while making a tortilla. Moreover, when we look up at the
        glorious canvas that is the night sky, we see the Moon, Sun and a host
        of other celestial bodies engaged in a perpetual, highly choreographed,
        dance that is powered by their mutual attraction to one another, or
        gravity in other words. While an anthropomorphic form of
        electromagnetism would probably object to what I am about to write,
        gravity is arguably the most familliar of the four forces of nature that
        we know of today. Sure, electromagnetism underpins all of chemistry, and
        therefore biology and ultimately us, but gravity is always there for us
        to notice, in a way that electromagnetism is not.
      </p>
      <p className="modal-item">
        With curiosity, comes a desire to understand. It is a train of thoughts
        that goes kind of like this: now that is interesting, but wait, how does
        it work? And what would happen if I were to change this quantity a tiny
        little bit? The late physicist Richard Feynman captured this feeling
        perfectly with the words "the pleasure of finding things out". It is,
        quite simply, the joy of being confronted with a mystery, and mustering
        all of your abilities to unlock its secrets.
      </p>
      <p className="modal-item">
        A year back, during one of those moments when you cannot focus and your
        thoughts start acting like puffy little white clouds being pushed on by
        the wind, I found myself wondering what would happen if you changed some
        of the parameters that describe our solar system, that is to say our
        Sun, the undisputed king, and its vassals of planets, asteroids, comets
        and in the past fifty or so years spacecrafts made by us. What would
        happen if I put Jupiter at the outer edge of the asteroid belt? Would a
        star passing at a distance ten times that of Pluto wreck our solar
        system, or would it be more of a pollite stellar meet and greet after
        which things proceed as normal? And what if I reduced the strength of
        the gravitational constant or had gravity obey Hook's law instead of the
        inverse square law that it obeys in our universe (things could be very
        different in another universe, mind you, but we have no way of knowing,
        so that is besides the point)?
      </p>
      <p className="modal-item">
        At the time I started asking myself these questions, I had no in-depth
        knowledge of physics, but I had my knowledge of JavaScript, on the one
        hand, and that most amazing of websites for a knowledge junkie like
        myself, Google, on the other, so I made up my mind to Google my way to
        an understanding of Newtonian physics and subsequently proceed by using
        this knowledge to develop a simulator that would allow me not only to
        test these scenarios, but also vizualize them.
      </p>
      <p className="modal-item">
        Starting out, I had difficulties finding material that was easy to
        digest. I stumbled through papers published in academic journals and
        quickly came to understand why I did not grow up to become an
        astrophysicist, but I kept at it and eventually I came across the
        Feynman lectures on physics, and the cork of the champagne bottle
        popped, so to say, and within a day of having read the chapters on
        Newtonian Dynamics, I had managed to write an algorithm for solving
        Newton's laws of motion and gravity numerically using the leapfrog
        method in XYZ space. I hooked it up to a cheap canvas based animation
        where celestial bodies were represented by colored circles and watched
        them go about their business of running circles around the sun and had
        copious amounts of fun trying out different configurations for the solar
        system (as it turns out, increasing the mass of Jupiter to half that of
        the Sun is not a good idea if maintaining stability in the inner solar
        system is one of your main concerns and priorities!).
      </p>
      <p className="modal-item">
        In the words of Carl Sagan, when you have fallen in love, you want to
        tell the world, and after having made a breakthrough I wanted to share
        it with my family, buddies and colleagues, but nobody appeared to be
        particularly amazed. The reactions I got were more along the lines of a
        pollite nod and a hesitant "That's nice with the dots flying around,
        could you perhaps turn the dots into pictures of myself and my friends
        so that I can show them a solar system where I am the Sun and my friends
        are the planets". Harkhark. That was not the reaction I was hoping for;
        I was hoping to spark, at the very least, a sense of awe at the universe
        we find ourselves in, and, at the very best, a seed of curiosity that
        would lead them to tackle these questions themselves (yes, in some
        regards I am horribly naive, but you can always try!).
      </p>
      <p className="modal-item">
        Then I had a realization: how successful would Armageddon have been as a
        movie if the asteroid, earth and, well, Bruce Willis I guess, would have
        been represented by a collection of dots moving about. We will probably
        never find out for certain, but my educated guess is that it would not
        have been the blockbuster success that it was. People want explosions,
        grand vistas and the like, which was why I decided to read up on
        THREE.js, a JavaScript framework for easily creating WebGL animations,
        and use it to vizualize my simulation in 3D, with planet textures, light
        and interactive controls.
      </p>
      <p className="modal-item">
        Upon having implemented the simulation in THREE.js, I showed my friends
        the modifications I had made to the simulator and the response was a
        much more positive one, with some even requesting additional features, a
        definitive sign of curiosity, all of which I plan on implementing in the
        coming months. Examples of these features include displaying information
        about the body being viewed, to make it a kind of 3D interactive solar
        system wikipedia, controls that allow the users not only to select the
        scenario to be simulated, but also modify every parameter of that
        scenario. The one feature that I am dreaming of implementing is a
        controllable spacecraft that you could explore the solar system with,
        and perhaps even perform orbital insertion manouvers; some epic
        celestial collisions would be nice, too. One step at a time, though.
      </p>
    </div>
  );
}
