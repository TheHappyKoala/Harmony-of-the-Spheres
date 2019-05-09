export interface VectorType {
  x: number;
  y: number;
  z: number;
}

export interface MassType {
  m?: number;
  color?: any;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export interface FixedTimeStepIntegratorType {
  g: number;
  dt: number;
  masses: MassType[];
  elapsedTime: number;
  softening: number;
  useBarnesHut: boolean;
  theta: number;
}

export interface TreeNodeType {
  size: number;
  position: VectorType;
  CoM: VectorType;
  mass: number;
  children: TreeNodeType[] | MassType[];
}
