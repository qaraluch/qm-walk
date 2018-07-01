const fs = require("fs");
const util = require("util");
const walk = require("../index.js");

const writeFile = util.promisify(fs.writeFile);

const mockupPath = "./test/fixtures";

(async () => {
  try {
    //Execute:
    const walkOutput = await walk({ path: mockupPath });
    const walkOutputExt = await walk({ path: mockupPath });
    const files = walkOutput.result;
    const filesMd = walkOutput.match(["*.md"]);
    const filesExtended = walkOutputExt.getExtendedInfo().result;

    //Saves:
    const save__walk = writeFile(
      "./examples/walk.json",
      JSON.stringify(files, null, 2)
    );

    const save__walkItem = writeFile(
      "./examples/walk-item.json",
      JSON.stringify(files[2], null, 2)
    );

    const save__walkExtended = writeFile(
      "./examples/walkExtended.json",
      JSON.stringify(filesExtended, null, 2)
    );

    const save__walkExtendedItem = writeFile(
      "./examples/walkExtended-item.json",
      JSON.stringify(filesExtended[2], null, 2)
    );

    const save__paths_md = writeFile(
      "./examples/paths-md.json",
      JSON.stringify(filesMd.map(itm => itm.path), null, 2)
    );

    const save__paths = writeFile(
      "./examples/paths.json",
      JSON.stringify(filesExtended.map(itm => itm.path), null, 2)
    );

    await Promise.all([
      save__paths,
      save__paths_md,
      save__walk,
      save__walkItem,
      save__walkExtended,
      save__walkExtended,
      save__walkExtendedItem
    ]);
  } catch (error) {
    console.error(error);
  }
})();
