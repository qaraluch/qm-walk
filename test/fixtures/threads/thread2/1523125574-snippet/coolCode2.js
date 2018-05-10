const excludeDirFilter = through2.obj(function (item, enc, next) {
  if (!item.stats.isDirectory()) this.push(item)
  next()
});