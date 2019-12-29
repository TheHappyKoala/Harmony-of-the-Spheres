import { getObjFromArrByKeyValuePair } from "../utils";
import { Manifestation } from "./ManifestationsService";

export default function(
  this: any,
  manifestation: Manifestation,
  rotatedPosition: Vector,
  delta: number
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
        manifestation
          .updateTrajectory(
            getObjFromArrByKeyValuePair(scenario.masses, "name", scenario.soi),
            scenario.masses[0],
            scenario.g,
            scenario.scale,
            this.camera.rotatingReferenceFrame
          )
          .draw(rotatedPosition, scenario.dt, scenario.scale, scenario.playing);
        break;

      default:
        manifestation.draw(rotatedPosition);
    }
  }
}
