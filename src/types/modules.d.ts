declare module "react-redux";
declare module "react-addons-css-transition-group";
declare module "colladaloader2asmodule";
declare const DEFAULT_SCENARIO: {
  name: string;
  fileName: string;
  type: string;
};
declare const EXOPLANET_ARCHIVE_DATA: { query: string; alias: string }[];
declare module "worker-loader!../../Physics/spacecraft/trajectoryCruncher" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
declare module "*.json" {
  const value: any;
  export default value;
}
