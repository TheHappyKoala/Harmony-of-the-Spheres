# Harmony of the Spheres
Newtonian n-body gravity simulator

[DEMO](https://thehappykoala.github.io/Harmony-of-the-Spheres/)

## Objective

* To provide people with a dazzling, fun and scientifically accurate introduction to physics and space that is accessible to anybody that has a modern browser installed on their device.
* Create simulations that can supplement and bring educational material on space and physics to life on websites such as [WikiPedia](https://www.wikipedia.org/).
* To assist researchers with reaching out to the public by creating simulations of their research findings, especially around the time of publishing as that is the time when it is most likely that media outlets publish news relating to their research and the public hears about it. I am a strong believer in that interactive and beautifully animated simulations can go a long way towards getting laymen more interested in science.

## Contribute

Got some time to spare and feel like contributing to this project? Awesome! If you find a bug or want to submit a new feature, hit me up with a pull request and we will take it from there. 

## Contributors

Below is an overview of the cool koalas that have made contributions to Harmony of the Spheres. Contributors are listed in the order that they started working on the project. 

| Contributors :rocket:   |      Work Done :hammer:      |  Profile :koala: |
|----------|:-------------:|------:|
| Darrell A. Huffman |  Developer and Maintainer | [More](https://thehappykoala.github.io)|
| Ryan Gowen |    Developer   |   [More](https://github.com/crGowen) |
| John Van Vlliet | Textures and 3D Models |    [More](https://github.com/JohnVV) |
| Hugo Granström | Developer |    [More](https://hugogranstrom.com/) |
| Camille Constant | Developer |    [More](https://github.com/epsxy) |

### Introductory Tutorial at CSS-Tricks

If you want to contribute to this project but do not know a thing about physics and scientific programming, I have written a [Tutorial](https://css-tricks.com/creating-your-own-gravity-and-space-simulator/) over at [CSS-Tricks](https://css-tricks.com/) that walks you through how to create your own gravity and space simulator witth JavaScript and the Canvas API. There are many ways in which you can contribute to this project, but even if your intention is not to work with the physics related code, it would probably be nice for you to have a basic understanding of what it is that makes everything go around in Harmony of the Spheres, and it is always awesome to learn something new, right?!

### Contributing Guidelines

To be decided. If you have a suggestion, please submit a pull request! 

## Run the App Locally
```npm run dev```
   
## Create a Production Build
```npm run build```

## Integrators
### Background
**Harmony of the Spheres** calculates the positions and velocities of the planets, moons and other space objects by integrating Newton's laws numerically. The ones used is *Newton's Law of Gravity* (`F = G * m * M / r^2`) and *Newton's Second Law* (`F = m * a`) to get the acceleration `d^2(r)/dt^2 = a = G * M / r^2`. There are numerous different methods to solve this equation, here called integrators, which have their pros and cons.
#### Barnes Hut
Doing this the brute force way requires us to calculate the force between ever single pair of bodies which means that we will roughly have to do `n^2` calculations to get all the accelerations if we have `n` space objects whirling around. This becomes very troublesome as `n` increases. For 10 planets we have to do 100 calculations but for 1000 planets we have to do 1000000 calculations. This starts to get out of hand. There are ways of lowering the complexity (with a certain loss in accuracy) so that the number of calculations doesn't fly off into space. One such method is Barnes Hut which has the complexity `n * ln(n)`. This means that for 10 planets we have to do 23 calculations and for 1000 planets we have to do just 7000 calculations which is much smaller than the one million we had to do before. Barnes Hut achieves this by treating many planets that are far away like a single planet with their cumulative mass located at their barycenter. But planets that are nearby are still calculated one by one as usual. This allows for simulating much larger collections of space objects. 
### Timestep `dt`
One thing they have in common is that they take small timesteps `dt` forward in time every iteration. Generally a bigger `dt` is faster but less accurate and a smaller `dt` is slower but more accurate. It's a science in itself to find the suitable balance between those two.
### Order of an integrator
The order of an integrator describes the relationship between the timestep `dt` and the error `E`. If the order is `n` then the error is proportional to `dt^n`. In other words if we half `dt` we lower the error by approx. `1/2^n`.
For example if we have `dt = 0.1`, `n = 2` and `E = 0.5` and instead use half the timestep (`dt = 0.05`) we should get a error roughly `E = 0.5 * 1/2^2 = 0.5/4 = 0.125`. If we instead had used a method of order 5 the error would have been `E = 0.5 * 1/2^5 = 0.5/32 = 0.015625` which is one order of magnitude smaller. The catch with higher order integrators is that they are remarkably slower if we don't need a tiny tiny error (`E > 1e-8`. In that case a lower order method can be more effective.
### Adaptive vs fixed `dt`
One way of finding a good balance between efficency and accuracy is to vary the timestep depending on how much is happening. 
"Are all the planets just cruising along in their orbits? Cool, let's use a bigger timestep". "Is a giant asteroid approaching Earth? Let's use a smaller timestep so we simulate the (hopefully) near impact accuratly". This is all done by the computer, all we have to provide is an error tolerance, the maximum allowed error in one timestep. If you watch the `dt`-slider when using an adaptive timestep you should either see it glued to the right or swooshing back and forth. 
### Symplectic Integrator
There exist general integrators that's suited for a variety of different problems (Runge Kutta for example) and then there are integrators that are specifically tailored for certain kinds of problems. Symplectic integrators are one such type of integrators. They are not necessarily more accurate but they do have properties that make them more suitable for long-time simulations. Mostly they preserve a quantity of the system (for example angular momentum and energy) so that the simulation is qualitatively accurate (the planets stay in their orbit and doesn't spiral into the Sun). But for simulations over a few thousand years this should not be a problem for the higher order non-symplectic integrators either, they are in fact often more efficient the symplectic integrators. The symplectic integrators are mainly useful for observing the general behavior of a system over long time periods. 
## List of Integrators
| Integrator | Order | Symplectic | Adaptive `dt` |
| ---------- | ----- | ---------- | ------------- |
| Euler | 1 | False | False |
| Verlet | 2 | True | False |
| RK4 | 4 | False | False |
| PEFRL | 4 | True | False |
| Nystrom3 | 4 | False | False |
| Nystrom4 | 5 | False | False |
| Nystrom5 | 6 | False | False |
| RKN64 | 6 | False | True |
| Yoshida6 | 6 | True | False |
| Nystrom6 | 7 | False | False |
| KahanLi8 | 8 | True | False |
| RKN12 | 12 | False | True |



## License

Copyright (C) 2019 Darrell Huffman - GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007

    


   



   
