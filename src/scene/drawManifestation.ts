import { Manifestation } from "./ManifestationsService";

export default function(
  this: any,
  manifestation: Manifestation,
  rotatedPosition: MassType,
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
        manifestation.draw(
          rotatedPosition,
          scenario.spacecraftDirections,
          scenario.thrustOn
        );

        manifestation.handleTrajectoryUpdate(scenario.mapMode, {
          mass,
          scenario,
          rotatingReferenceFrame: this.camera.rotatingReferenceFrame
        });

        break;

      default:
        manifestation.draw(rotatedPosition);

        manifestation.handleTrajectoryUpdate(
          (scenario.rotatingReferenceFrame !== mass.name && scenario.mapMode) ||
            (scenario.type === "Exoplanets" &&
              (scenario.rotatingReferenceFrame === "Barycenter" ||
                scenario.rotatingReferenceFrame === scenario.masses[0].name) &&
              scenario.cameraFocus === "Barycenter" &&
              scenario.cameraPosition === "Free") ||
            (scenario.type === "Exoplanets" &&
              (scenario.rotatingReferenceFrame === "Barycenter" ||
                scenario.rotatingReferenceFrame === scenario.masses[0].name) &&
              scenario.cameraFocus === "Habitable Zone" &&
              scenario.cameraPosition === "Free") ||
            (scenario.type === "Exoplanets" &&
              (scenario.rotatingReferenceFrame === "Barycenter" ||
                scenario.rotatingReferenceFrame === scenario.masses[0].name) &&
              scenario.cameraFocus === scenario.masses[0].name &&
              scenario.cameraPosition === "Free"),
          {
            mass,
            scenario,
            rotatingReferenceFrame: this.camera.rotatingReferenceFrame
          }
        );
    }
  }
}
