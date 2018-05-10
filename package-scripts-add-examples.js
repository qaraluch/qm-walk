const { series, concurrent, rimraf } = require("nps-utils");

const cleanNodeModules = rimraf("node_modules");

module.exports = {
  scripts: {
    default: "node index.js",
    examples: {
      default: {
        description: "run examples",
        script: "node examples/run.js"
      }
    }
  },
  options: {
    silent: false
  }
};
