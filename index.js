const nodePath = require("path");
const klaw = require("klaw");
//[jprichardson/node-klaw: A Node.js file system walker with a Readable stream interface. Extracted from fs-extra.](https://github.com/jprichardson/node-klaw)
//npm i -S klaw

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

function walk(options) {
  const { path, filterOut } = resolveOptions(options);
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

async function walkProcessed(options) {
  const rawOutput = await walk(resolveOptions(options));

  const walkCwdReducer = (acc, next) =>
    acc.length < next.path.length ? acc : next.path;
  const walkCwd = R.reduce(walkCwdReducer, rawOutput[0].path, rawOutput);

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
  const addName = item => {
    item.name = nodePath.basename(item.path);
    return item;
  };
  const xform = R.compose(
    R.filter(removeItemWithCwdOnly(walkCwd)),
    R.map(addCwd(walkCwd)),
    R.map(addCrown(walkCwd)),
    R.map(addParent),
    R.map(addIsFileMapper),
    R.map(addName)
  );
  const processedTransducer = R.into([], xform);
  return processedTransducer(rawOutput);
}

module.exports = {
  walk,
  walkProcessed
};
