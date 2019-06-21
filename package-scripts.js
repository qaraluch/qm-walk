const { series, concurrent, rimraf } = require("nps-utils");

const cleanNodeModules = rimraf("node_modules");

module.exports = {
  scripts: {
    default: "node index.js",
    clear: {
      default: {
        description: "Deletes the `node_modules` directory",
        script: series(cleanNodeModules)
      }
    },
    test: {
      default: {
        description: "ava test",
        script: "ava --verbose test/index.test.js"
      }
    },
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
