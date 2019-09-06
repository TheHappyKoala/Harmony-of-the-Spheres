# Harmony of the Spheres
Newtonian n-body gravity simulator

![Moons acting out around Mars](src/images/lunacy-min.gif)

![Earth spoiling the rings of Saturn](src/images/saturn-min.gif)

[DEMO](https://thehappykoala.github.io/Harmony-of-the-Spheres/)


## About

Harmony of the Spheres is a Newtonian n-body gravity simulator that lets the user explore and interact with Newton's laws of motion and gravity in the context of a wide variety scenarios that range from our solar system to sublime n-body choreographies that could not exist anywhere but on paper. Just recently, thanks to the excellent [Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu), Harmony of the Spheres has also become an up-to-date repository for simulations of exosystems, and at the time of writing, the first tentative steps towards making Harmony of the Spheres capable of simulating space flight have been made with the development of a module for calculating the change in velocity required to get from position a to b in time t. In the near future, the plan is to enable users to run Barnes-Hut simulations of large assemblies of stars, such as globular clusters and even galaxies. 

The mission that propels the development of Harmony of the Spheres is the belief interactive simulations can facilitate learning in a way that textbooks, videos and images simply cannot: what better way to acquire an intuitive understanding of orbital elements than to be able to set them yourself for bodies that you add to a simulation, for example? However, while software can be great for facilitating learning, the fact remains that if access to it is constrained by cost of access or not having the right soft or hardware, the reach of the software and its potential as a tool for learning are diminished, which is why the choice was made early on to make Harmony of the Spheres a web application, since web applications, by and large, run on any device, operating system or browser, and the user does not even have to install anything on their device to get going. By making it an open source project, we hope that the project can reach heights that otherwise would have been beyond reach by allowing anybody to identify areas of improvement, and even develop solutions themselves. 

More than anything, though, the reason why this project is still a living one, after a little bit more than a year of development, is that we have fun working on it, and that is the ultimately the most important criterion that sets the trajectory of Harmony of the Spheres... That we're having fun while we're at it. Sometimes this means features are developed haphazardly, as if we feel like we're getting tired of working on feature a, we have no qualms about dropping it for a while to focus on feature b, or just take a break altogether. Not the best philosophy for developing software, perhaps, but as far as keepnig an open source project that is entirely reliant on the contributors putting their time and love into it on an entirely voluntary basis with no financial rewards, it's an excellent one!


## Contribute

So you have identified a bug, or maybe even a feature that you think should be included? Great, then we suggest that you open an issue, create a branch and when you're done, issue a pull request that we can review. All kinds of contributions are welcome, whether they be ui, physics, content or graphics related. Before you move on to fork the repository and start working on your feature or patch, though, you should read the below section, in which the stack of this project is discussed. 


## Stack

Harmony of the Spheres is built on a diverse range of technologies, each of which is briefly discussed below.

### UI

The UI of Harmony of the Spheres is built with React. It's been asked on a couple of occasions why we don't use an existing library of React components instead of developing our own ones, and the answer is that while coding for performance is usually a bad idea, when you are developing an app that is concerned with physics simulations, this is very much not the case, and unfortunately no existing library does a good enough job in preventing unnecessary rerenders. Secondly, by developing our own custom components, we have granular control, which makes extending their functionality to suit the very specific and evolving needs of Harmony of the Spheres so much easier. 

While there are a few class-based React components still being used in the project, all new components are functional and use hooks to manage internal state. The plan is eventually to rid the project entirely of class based components in favour of functional ones, and while great progress has been made in this regard, it is not a priority at present.

### Graphics

For the graphics, we use the excellent three.js for the 3D graphics, and plain canvas rendering for the 2D graphics. We aim to progressively handle more and more of the graphics code on the GPU, so as to squeeze even more performance out of the app. 

### Physics

All the physics code used in Harmony of the Spheres was developed from scratch, in part, to ensure maximum performance and a simple API to work with, but the biggest reason is that writing physics code is a riot of fun, and as previously mentioned, we're all about having fun here!

### State

With the exception of internal component state, all state in Harmony of the Spheres is handled with Redux. One of the initial challenges when development on this project began was how to have React and three.js play well together, and to keep the UI in sync with the scene and the physics code that powered it. One option was to use a three.js React bindings library, but it was quickly realised that these are highly unperformant, and that they didn't allow you to tap the full power of the three.js library and only included a sub-set of its functionality, so this approach was quickly rejected. In the end, it was decided to use Redux, as it allowed us to keep the scene in-sync with the UI through the Redux store and its dispatch method, and then all we had to do was to expose an init and reset method for our scene to the UI, where the init method takes two canvas elements rendered with React for the 3D and 2D graphics respectively. The beauty of this approach is that it allows us to separate the concern of rendering the scene and the concern of rendering the UI: if we wanted to ditch React in favour of Angular for whatever reason, the scene couldn't care less as long as it got its two canvas elements. 

### TypeScript

Originally the codebase was all written in plain JavaScript, but when a certain scale was reached, this quickly became untenable, and the decision was made to migrate the codebase to TypeScript so as to provide a saner and more predictable development experience. We expect that any contributions are written in TypeScript, and while there's still some JavaScript code left, it is not much, and the goal is to eventually have the whole codebase in TypeScript. 


## Pre-commit Hooks

For the time being, the only pre-commit hook in place is one that prettifies the code before it is submitted, to make sure all code is uniformly and properly formatted, but the plan is to add hooks for commit messages and TypeScript linting, as well, shortly. 


## Commands

Getting up and running with Harmony of the Spheres is a simple affair.

### Run the App Locally
```npm run dev```
   
### Create a Production Build
```npm run build```

### Prettify the Code
```npm run prettier```


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

    


   



   
