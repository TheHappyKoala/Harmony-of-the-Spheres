import Euler from './Euler';
import {constructSOITree, propagateOrbitalElements, keplerToState, stateToKepler} from '../spacecraft/lambert';
import { getObjFromArrByKeyValuePair } from '../../utils';

export default class extends Euler {
  recursiveMove(tree: SOITree, parent: MassType, newParentPos: Vector, newParentVel: Vector): void {
    const nChildren = tree.children.length;
    const gm = this.g * parent.m;
    const body: MassType = getObjFromArrByKeyValuePair(this.masses, 'name', tree.name);
    const bodyPos = {x: body.x, y: body.y, z: body.z};
    const relPos = {x: body.x - parent.x, y: body.y - parent.y, z: body.z - parent.z};
    const relVel = {x: body.vx - parent.vx, y: body.vy - parent.vy, z: body.vz - parent.vz};

    const orbElem1 = stateToKepler(relPos, relVel, gm);
    const orbElem2 = propagateOrbitalElements(orbElem1, this.dt, gm);
    const newStateVectors = keplerToState(orbElem2, gm);
    const newRelPos = newStateVectors.posRel;
    const newRelVel = newStateVectors.velRel;
    const newPos = {x: newParentPos.x + newRelPos.x, y: newParentPos.y + newRelPos.y, z: newParentPos.z + newRelPos.z};
    const newVel = {x: newParentVel.x + newRelVel.x, y: newParentVel.y + newRelVel.y, z: newParentVel.z + newRelVel.z};
    if (nChildren == 0) {
      body.x = newPos.x;
      body.y = newPos.y;
      body.z = newPos.z;
      body.vx = newVel.x;
      body.vy = newVel.y;
      body.vz = newVel.z;
      return
    } else {
      for (let i = 0; i < nChildren; i++) {
        let childTreeI = tree.children[i];
        this.recursiveMove(childTreeI, body, newPos, newVel);
      }
      body.x = newPos.x;
      body.y = newPos.y;
      body.z = newPos.z;
      body.vx = newVel.x;
      body.vy = newVel.y;
      body.vz = newVel.z;
      return
    }
  }

  iterate(): void {
    const tree = constructSOITree(this.masses);
    const sun: MassType = getObjFromArrByKeyValuePair(this.masses, 'name', tree.name);
    const sunPos = {x: sun.x, y: sun.y, z: sun.z};
    const sunVel = {x: sun.vx, y: sun.vy, z: sun.vz}; // maybe need to set this to 0?
    const nChildren = tree.children.length;
    for (let i = 0; i < nChildren; i++){
      const childTreeI = tree.children[i];
      this.recursiveMove(childTreeI, sun, sunPos, sunVel);
    }

    this.incrementElapsedTime();
  }
}
