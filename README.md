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
const { walk, walkProcessed } = require("qm-walk");

const options = {
  path: "some/path", //default === cwd
  filterOut: [".git", "node_modules"] //default
};

(async () => {
  const files = await walk(options); // default path === cwd
  files; // => [ {path: "./foo/bar.txt" stats: {fs.stats}, ... ]
})();

(async () => {
  const files = await walkProcessed(options);
  files; // => [ { path, stats, cwd, crown, parent, isFile, name, ext } ]
})();
```

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
  + checks:
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
