# qm-walk

> File system walker. Promisified, sugar-coated wrapper for npm [klaw](https://github.com/jprichardson/node-klaw) module.

:warning: Disclaimer:

This module is published in good faith and for learning purpose only. The code is not production-ready, so any usage of it is strictly at your own risk :see_no_evil:.

## Installation

```
npm i -S qm-walk
```

## Usage

```js
const walk = require("qm-walk");

const options = {
  path: "some/path", //default === cwd
  filterOut: [".git", "node_modules"] //default
};

// Simple usage:
(async () => {
  const filesObj = await walk(options);
  filesObj.result; // => [ {path: "./foo/bar.txt" stats: {fs.stats}, ... ]
})();

// Extended info usage:
(async () => {
  const filesObjExtended = await walk(options).getExtendedInfo();
  filesObjExtended.result; // => [ { path, stats, cwd, crown, parent, isFile, name, ext } ]
})();

// Glob usage:
const globOptions = { nocase: true };
(async () => {
  const filesMd = await walk(options)
    .getExtendedInfo()
    .match(["*.md"], globOptions); //  => array of .md or .MD files
})();
```

## Glob usage

For glob usage details please see [sindresorhus/multimatch](https://github.com/sindresorhus/multimatch) documentation.
You can pass glob options too. See available options on [isaacs/minimatch](https://github.com/isaacs/minimatch#options).

## Stats object

Mostly contains node's fs states. See [docs](https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats) for more info.

```
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
  isFile
  isDirectory
  isBlockDevice
  isCharacterDevice
  isSymbolicLink
  isFIFO
  isSocket
}
```

For more info read the source code and test files :page_facing_up:.

## License

MIT © [qaraluch](https://github.com/qaraluch)
