export interface VectorType {
  x: number;
  y: number;
  z: number;
}

export interface MassType {
  name?: string;
  color?: string;
  hsl?: number[];
  m?: number;
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  [x: string]: any;
}

export interface IntegratorType {
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

export interface TreeNodeType {
  size: number;
  position: VectorType;
  CoM: VectorType;
  mass: number;
  children: TreeNodeType[] | MassType[];
}

export interface SOITree {
  name: string;
  SOIradius: number;
  children: Array<SOITree>;
  m?: number;
  x?: number;
  y?: number;
  z?: number;
}
