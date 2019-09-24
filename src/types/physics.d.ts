interface Vector {
  x: number;
  y: number;
  z: number;
}

interface MassType {
  name?: string;
  color?: string;
  m?: number;
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  [x: string]: any;
}

interface IntegratorType {
  g: number;
  dt: number;
  tol?: number;
  minDt?: number;
  maxDt?: number;
  masses: MassType[];
  elapsedTime: number;
  softening?: number;
  useBarnesHut?: boolean;
  theta?: number;
}

interface TreeNodeType {
  size: number;
  position: Vector;
  CoM: Vector;
  mass: number;
  children: TreeNodeType[] | MassType[];
}

interface TreeNodeType {
  size: number;
  position: Vector;
  CoM: Vector;
  mass: number;
  children: TreeNodeType[] | MassType[];
}

interface SOITree {
  name: string;
  SOIradius: number;
  children: SOITree[];
  m?: number;
  x?: number;
  y?: number;
  z?: number;
}
