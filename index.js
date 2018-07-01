const nodePath = require("path");
const klaw = require("klaw");
//[jprichardson/node-klaw: A Node.js file system walker with a Readable stream interface. Extracted from fs-extra.](https://github.com/jprichardson/node-klaw)
//npm i -S klaw

const multimatch = require("multimatch");
const matcher = require("matcher");
// [sindresorhus/multimatch: Extends minimatch.match() with support for multiple patterns](https://github.com/sindresorhus/multimatch)
// npm i -S multimatch

const R = require("ramda");
//[Ramda Documentation](http://ramdajs.com/docs/)
//npm i -S ramda

const cwd = process.cwd();

function resolveOptions(options = {}) {
  const defaultOptions = {
    path: cwd,
    filterOut: [".git", "node_modules"]
  };
  const endOptions = Object.assign({}, defaultOptions, options);
  return endOptions;
}

function klawWrapper(options) {
  const { path, filterOut } = options;
  const pathResolved = nodePath.resolve(cwd, path);
  const filterFn = filePath =>
    !filterOut.map(item => RegExp(item, "g").test(filePath)).some(Boolean);
  return new Promise((resolve, reject) => {
    const items = [];
    const walkStream = klaw(pathResolved, {
      queueMethod: "pop",
      filter: filterFn
    });
    walkStream.close = function() {
      this.paths = [];
    };
    walkStream
      .on("readable", function() {
        let item;
        while ((item = this.read())) {
          items.push({
            path: item.path,
            stats: {
              ...item.stats,
              isFile: item.stats.isFile(),
              isDirectory: item.stats.isDirectory(),
              isBlockDevice: item.stats.isBlockDevice(),
              isCharacterDevice: item.stats.isCharacterDevice(),
              isSymbolicLink: item.stats.isSymbolicLink(),
              isFIFO: item.stats.isFIFO(),
              isSocket: item.stats.isSocket()
            }
          });
        }
      })
      .on("end", () => resolve(items))
      .on("error", function(err) {
        this.close();
        reject(err);
      });
  }).catch(error => {
    throw new Error(
      `Sth went wrong with 'walk' module: \n
      ${error.stack} \n      `
    );
  });
}

const removeItemWithCwdOnly = walkCwd => item => item.path !== walkCwd;

const addCwd = walkCwd => item => {
  item.cwd = walkCwd;
  return item;
};

const addCrown = walkCwd => item => {
  // crown = path - cwd
  item.crown = item.path.substr(walkCwd.length);
  return item;
};

const addParent = item => {
  item.parent = nodePath.basename(nodePath.dirname(item.path));
  return item;
};

const addIsFileMapper = item => {
  item.isFile = item.stats.isFile;
  return item;
};

const getName = item => nodePath.basename(item.path);

const addName = item => {
  item.name = getName(item);
  return item;
};

const addExt = item => {
  item.ext = nodePath.extname(item.path);
  return item;
};

function getExtendedInfo() {
  const rawOutput = this.result;
  const walkCwdReducer = (acc, next) =>
    acc.length < next.path.length ? acc : next.path;
  const walkCwd = R.reduce(walkCwdReducer, rawOutput[0].path, rawOutput);
  const xform = R.compose(
    R.filter(removeItemWithCwdOnly(walkCwd)),
    R.map(addCwd(walkCwd)),
    R.map(addCrown(walkCwd)),
    R.map(addParent),
    R.map(addIsFileMapper),
    R.map(addName),
    R.map(addExt)
  );
  const processedTransducer = R.into([], xform);
  this.result = processedTransducer(rawOutput);
  return this;
}

const methods = {
  match,
  getExtendedInfo
};

function match(glob) {
  const result = this.result;
  const names = result.map(getName);
  const matchedNames = multimatch(names, glob);
  const walkResultReducer = (acc, next) => {
    const nextName = getName(next);
    matchedNames.includes(nextName) ? acc.push(next) : acc;
    return acc;
  };
  const matched = R.reduce(walkResultReducer, [], result);
  return matched;
}

module.exports = async function walk(options) {
  const state = Object.assign(
    Object.create(null),
    {
      options: resolveOptions(options)
    },
    methods
  );
  const doneWalk = await klawWrapper(state.options);
  state.result = doneWalk;
  return state;
};
