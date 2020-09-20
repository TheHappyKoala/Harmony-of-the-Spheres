import { getObjFromArrByKeyValuePair } from "../utils";
import { Manifestation } from "./ManifestationsService";

export default function(
  this: any,
  manifestation: Manifestation,
  rotatedPosition: Vector,
  delta: number,
  mass: MassType
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

    switch (manifestation.mass.massType) {
      case "star":
        manifestation.draw(rotatedPosition, delta, scenario.habitableZone);
        break;

      case "spacecraft":
        if (scenario.cameraFocus !== manifestation.mass.name) {
          manifestation.updateTrajectory(
            getObjFromArrByKeyValuePair(scenario.masses, "name", scenario.soi),
            scenario.masses[0],
            scenario.g,
            scenario.scale,
            this.camera.rotatingReferenceFrame
          );
        }

        manifestation.draw(
          rotatedPosition,
          scenario.spacecraftDirections,
          scenario.thrustOn
        );
        break;

      default:
        manifestation.draw(rotatedPosition);

        if (
          scenario.cameraFocus !== manifestation.mass.name &&
          scenario.forAllMankind &&
          (manifestation.mass.name === scenario.masses[0].name ||
            manifestation.mass.name === scenario.trajectoryTarget)
        ) {
          manifestation.updateTrajectory(
            getObjFromArrByKeyValuePair(scenario.masses, "name", scenario.soi),
            mass,
            scenario.g,
            scenario.scale,
            this.camera.rotatingReferenceFrame
          );
        } else {
          manifestation.removeTrajectory();
        }
    }
  }
}
