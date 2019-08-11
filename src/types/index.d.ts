declare module 'react-redux';
declare module 'react-addons-css-transition-group';
declare const DEFAULT_SCENARIO: string;
declare const EXOPLANET_ARCHIVE_DATA: { query: string; alias: string }[];
declare module 'worker-loader!../../Physics/spacecraft/trajectoryCruncher' {
  class WebpackWorker extends Worker {
    constructor();
  }

  export default WebpackWorker;
}
