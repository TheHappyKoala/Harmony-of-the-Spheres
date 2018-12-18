import MassManifestation from './MassManifestation';

const ColladaLoader = require('three-collada-loader');

export default class extends MassManifestation {
  constructor(mass, manager) {
    super(mass, manager);
  }

  getMain() {
    const massNameLowerCase = this.mass.texture.toLowerCase();

    const loader = new ColladaLoader(this.manager);
    loader.options.convertUpAxis = true;
    loader.load(
      `./models/${massNameLowerCase}/${massNameLowerCase}.dae`,
      collada => {
        collada.scene.scale.set(
          this.mass.radius,
          this.mass.radius,
          this.mass.radius
        );

        collada.scene.name = 'Main';

        this.add(collada.scene);
      }
    );
  }
}
