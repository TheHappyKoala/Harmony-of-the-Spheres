import H3 from '../vectors';

export default class {
  g: number;
  dt: number;
  tol: number;
  maxDt: number;
  minDt: number;
  masses: any[];
  elapsedTime: number;
  softening: number;
  softeningSquared: number;
  useBarnesHut: boolean;
  theta: number;
  maximumDistance: number;

  a: H3;
  v: H3;
  p: H3;

  constructor({ g, dt, masses, elapsedTime }: IntegratorType) {
    this.g = g;
    this.dt = dt;
    this.masses = masses;
    this.softening = 0;
    this.softeningSquared = this.softening * this.softening;

    this.useBarnesHut = true;
    this.theta = 0.5;
    this.maximumDistance = 1000;

    this.elapsedTime = elapsedTime;

    this.a = new H3();
    this.v = new H3();
    this.p = new H3();
  }

  getDistanceParams(p1: Vector, p2: Vector) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    return { dx, dy, dz, dSquared: dx * dx + dy * dy + dz * dz };
  }

  getStateVectors(m: MassType[]): { p: Vector[]; v: Vector[] } {
    const p = [];
    const v = [];
    const mLen = m.length;

    for (let i = 0; i < mLen; i++) {
      let mI = m[i];

      p[i] = {
        x: mI.x,
        y: mI.y,
        z: mI.z
      };

      v[i] = {
        x: mI.vx,
        y: mI.vy,
        z: mI.vz
      };
    }

    return { p, v };
  }

  updateStateVectors(p: Vector[], v: Vector[]): void {
    const mLen = p.length;

    for (let i = 0; i < mLen; i++) {
      let pI = p[i];
      let vI = v[i];
      let m = this.masses[i];

      m.x = pI.x;
      m.y = pI.y;
      m.z = pI.z;
      m.vx = vI.x;
      m.vy = vI.y;
      m.vz = vI.z;
    }
  }

  generatePositionVectors(v: Vector[], dt: number): Vector[] {
    const p = [];
    const vLen = v.length;

    for (let i = 0; i < vLen; i++) {
      let vI = v[i];
      let m = this.masses[i];

      p[i] = this.p
        .set({ x: m.x, y: m.y, z: m.z })
        .addScaledVector(dt, { x: vI.x, y: vI.y, z: vI.z })
        .toObject();
    }

    return p;
  }

  generateAccelerationVectors(p: Vector[]): Vector[] {
    if (this.useBarnesHut) {
      const tree = this.constructBHTree(p);
      const a = this.BHGenerateAccelerationVectors(p, tree);
      return a;
    } else {
      const a = [];
      const pLen = p.length;

      for (let i = 0; i < pLen; i++) {
        this.a.set({ x: 0, y: 0, z: 0 });

        let pI = p[i];

        for (let j = 0; j < pLen; j++) {
          if (i !== j && this.masses[j].m > 0) {
            let pJ = p[j];

            let dParams = this.getDistanceParams(pI, pJ);

            let fact =
              this.g *
              this.masses[j].m /
              Math.pow(dParams.dSquared + this.softeningSquared, 1.5);

            this.a.addScaledVector(fact, {
              x: dParams.dx,
              y: dParams.dy,
              z: dParams.dz
            });
          }
        }

        a[i] = { x: this.a.x, y: this.a.y, z: this.a.z };
      }

      return a;
    }
  }

  generateVelocityVectors(a: Vector[], dt: number): Vector[] {
    const v = [];
    const aLen = a.length;

    for (let i = 0; i < aLen; i++) {
      let aI = a[i];
      let m = this.masses[i];

      v[i] = this.v
        .set({ x: m.vx, y: m.vy, z: m.vz })
        .addScaledVector(dt, { x: aI.x, y: aI.y, z: aI.z })
        .toObject();
    }

    return v;
  }

  sync(scenario: ScenarioState) {
    this.g = scenario.g;
    this.masses = scenario.masses;
    this.tol = scenario.tol;
    this.dt = scenario.dt;
    this.minDt = scenario.minDt;
    this.maxDt = scenario.maxDt;
    this.useBarnesHut = scenario.useBarnesHut;
    this.theta = scenario.theta;
    this.softeningSquared =
      scenario.softeningConstant * scenario.softeningConstant;
  }

  iterate(): void {
    const s = this.getStateVectors(this.masses);

    const a = this.generateAccelerationVectors(s.p);
    const v = this.generateVelocityVectors(a, this.dt);
    const p = this.generatePositionVectors(s.v, this.dt);

    this.updateStateVectors(p, v);

    this.incrementElapsedTime();
  }

  incrementElapsedTime() {
    this.elapsedTime += this.dt;
  }

  // Below slumbers the mighty Barnes Hut
  isInTree(p: Vector, tree: TreeNodeType): boolean {
    const a = tree.size;
    if (
      tree.position.x <= p.x &&
      p.x < tree.position.x + a &&
      (tree.position.y <= p.y && p.y < tree.position.y + a) &&
      (tree.position.z <= p.z && p.z < tree.position.z + a)
    ) {
      return true;
    } else {
      return false;
    }
  }

  generateChildren(tree: TreeNodeType): TreeNodeType[] {
    const a = tree.size / 2;
    let v = new H3();
    const tree1 = {
      size: a,
      position: tree.position,
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const tree2 = {
      size: a,
      position: v
        .set(tree.position)
        .add({ x: 0, y: a, z: 0 })
        .toObject(),
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const tree3 = {
      size: a,
      position: v
        .set(tree.position)
        .add({ x: a, y: 0, z: 0 })
        .toObject(),
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const tree4 = {
      size: a,
      position: v
        .set(tree.position)
        .add({ x: a, y: a, z: 0 })
        .toObject(),
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const tree5 = {
      size: a,
      position: v
        .set(tree.position)
        .add({ x: 0, y: 0, z: a })
        .toObject(),
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const tree6 = {
      size: a,
      position: v
        .set(tree.position)
        .add({ x: 0, y: a, z: a })
        .toObject(),
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const tree7 = {
      size: a,
      position: v
        .set(tree.position)
        .add({ x: a, y: 0, z: a })
        .toObject(),
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const tree8 = {
      size: a,
      position: v
        .set(tree.position)
        .add({ x: a, y: a, z: a })
        .toObject(),
      CoM: { x: 0, y: 0, z: 0 },
      nMasses: 0,
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    return [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8];
  }

  insertMassInTree(mass: MassType, tree: TreeNodeType): void {
    const nChildren = tree.children.length;
    // if empty
    if (nChildren === 0) {
      tree.children = [mass];
      return;
    } else if (nChildren == 1) {
      const otherMass = tree.children[0];
      tree.children = this.generateChildren(tree);
      this.insertMassInTree(mass, tree);
      this.insertMassInTree(<MassType>otherMass, tree);
      return;
    } else if (nChildren === 8) {
      for (let i = 0; i < 8; i++) {
        if (
          this.isInTree({ x: mass.x, y: mass.y, z: mass.z }, <TreeNodeType>tree
            .children[i])
        ) {
          const v = new H3();
          tree.CoM = v
            .set(tree.CoM)
            .addScaledVector(mass.m, { x: mass.x, y: mass.y, z: mass.z })
            .toObject();
          tree.mass += mass.m;
          this.insertMassInTree(mass, <TreeNodeType>tree.children[i]);
        }
      }
    }
  }

  fixCoM(tree: TreeNodeType): void {
    const nChildren = tree.children.length;
    const v = new H3();
    if (nChildren === 8) {
      tree.CoM = v
        .set(tree.CoM)
        .multiplyByScalar(1 / tree.mass)
        .toObject();
      for (let i = 0; i < 8; i++) {
        this.fixCoM(<TreeNodeType>tree.children[i]);
      }
    }
    return;
  }

  constructBHTree(p: MassType[]): TreeNodeType {
    const a = this.maximumDistance;
    const tree = {
      size: a,
      position: { x: -a / 2, y: -a / 2, z: -a / 2 },
      CoM: { x: -a / 2, y: -a / 2, z: -a / 2 },
      mass: 0,
      children: <TreeNodeType[] | MassType[]>[]
    };

    const pLen = this.masses.length;
    for (let i = 0; i < pLen; i++) {
      p[i].m = this.masses[i].m;
      this.insertMassInTree(p[i], tree);
    }
    this.fixCoM(tree);

    return tree;
  }

  BHAccelerate(p: Vector, tree: TreeNodeType): Vector | null {
    const v = new H3();
    const nChildren = tree.children.length;
    if (nChildren === 0) {
      return { x: 0, y: 0, z: 0 };
    } else if (nChildren === 1) {
      const other = <MassType>tree.children[0];
      v.set({ x: other.x, y: other.y, z: other.z });
      const rVector = v.subtract(p);
      const r = rVector.getLength();
      //
      // add softening here
      //
      if (r === 0) {
        return { x: 0, y: 0, z: 0 };
      }
      const acc = rVector
        .multiplyByScalar(
          other.m * this.g / Math.pow(r * r + this.softeningSquared, 1.5)
        )
        .toObject();
      return acc;
    } else if (nChildren === 8) {
      const rVector = v.set(tree.CoM).subtract(p);
      const r = rVector.getLength();
      if (r === 0) {
        return { x: 0, y: 0, z: 0 };
      }
      if (tree.size / r < this.theta) {
        const acc = rVector
          .multiplyByScalar(
            this.g * tree.mass / Math.pow(r * r + this.softeningSquared, 1.5)
          )
          .toObject();
        return acc;
      } else {
        let totalAcc = v.set({ x: 0, y: 0, z: 0 });
        for (let i = 0; i < 8; i++) {
          totalAcc = totalAcc.add(
            this.BHAccelerate(p, <TreeNodeType>tree.children[i])
          );
        }
        return totalAcc.toObject();
      }
    }

    return null;
  }

  BHGenerateAccelerationVectors(p: Vector[], tree: TreeNodeType): Vector[] {
    const nP = p.length;
    const acc = [];
    for (let i = 0; i < nP; i++) {
      acc[i] = this.BHAccelerate(p[i], tree);
    }
    return acc;
  }
}
