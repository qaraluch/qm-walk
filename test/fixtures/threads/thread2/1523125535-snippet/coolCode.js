const klaw = require('klaw')
const items = [] // files, directories, symlinks, etc
klaw('/some/dir')
  .on('readable', function () {
    let item
    while ((item = this.read())) {
      items.push(item.path)
    }
  })
  .on('end', () => console.dir(items)) // => [ ... array of files]