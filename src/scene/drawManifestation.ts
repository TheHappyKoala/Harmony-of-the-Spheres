import { Manifestation } from "./ManifestationsService";
import { findCurrentSOI } from "../physics/spacecraft/lambert";

export default function(
  this: any,
  manifestation: Manifestation,
  rotatedPosition: Vector,
  delta: number,
  mass: MassType,
  SOITree: SOITree
) {
  const scenario: ScenarioState = this.scenario;
  const previousRotatingReferenceFrame: string = this.previous
    .rotatingReferenceFrame;

  if (typeof manifestation !== "undefined") {
    manifestation.drawTrail(
      rotatedPosition,
      scenario.playing,
      scenario.trails,
      scenario.cameraFocus,
      scenario.rotatingReferenceFrame,
      previousRotatingReferenceFrame,
      scenario.reset,
      scenario.dt
    );

    let currentSOI;

    switch (manifestation.mass.massType) {
      case "star":
        manifestation.draw(rotatedPosition, delta, scenario.habitableZone);
        break;

      case "spacecraft":
        manifestation.draw(
          rotatedPosition,
          scenario.spacecraftDirections,
          scenario.thrustOn
        );

        currentSOI = findCurrentSOI(
          scenario.masses.find(massEntry => massEntry.name === mass.name),
          SOITree,
          scenario.masses
        );

        manifestation.handleTrajectoryUpdate(scenario.mapMode, {
          mass,
          scenario,
          rotatingReferenceFrame: this.camera.rotatingReferenceFrame,
          currentSOI
        });

        break;

      default:
        manifestation.draw(rotatedPosition);

        currentSOI = findCurrentSOI(
          scenario.masses.find(massEntry => massEntry.name === mass.name),
          SOITree,
          scenario.masses
        );

        manifestation.handleTrajectoryUpdate(
          (scenario.rotatingReferenceFrame !== mass.name &&
            scenario.mapMode &&
            currentSOI.name === scenario.rotatingReferenceFrame) ||
            ((scenario.rotatingReferenceFrame === "Barycenter" ||
              scenario.rotatingReferenceFrame === scenario.masses[0].name) &&
              scenario.cameraFocus === "Barycenter" &&
              scenario.mapMode),
          {
            mass,
            scenario,
            rotatingReferenceFrame: this.camera.rotatingReferenceFrame,
            currentSOI
          }
        );
    }
  }
}
