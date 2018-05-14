const fs = require("fs");
const util = require("util");
const { walk, walkProcessed } = require("../index.js");

const writeFile = util.promisify(fs.writeFile);

const mockupPath = "./test/fixtures";

(async () => {
  try {
    //Execute:
    const [walkOutput, walkProcessedOutput] = await Promise.all([
      walk({ path: mockupPath }),
      walkProcessed({
        path: mockupPath
      })
    ]);

    //Saves:
    const save__walk = writeFile(
      "./examples/walk.json",
      JSON.stringify(walkOutput, null, 2)
    );

    const save__walkItem = writeFile(
      "./examples/walk-item.json",
      JSON.stringify(walkOutput[2], null, 2)
    );

    const save__walkProcessed = writeFile(
      "./examples/walkProcessed.json",
      JSON.stringify(walkProcessedOutput, null, 2)
    );

    const save__walkProcessedItem = writeFile(
      "./examples/walkProcessed-item.json",
      JSON.stringify(walkProcessedOutput[2], null, 2)
    );

    const save__paths = writeFile(
      "./examples/paths.json",
      JSON.stringify(walkProcessedOutput.map(item => item.path), null, 2)
    );

    await Promise.all([
      save__paths,
      save__walk,
      save__walkProcessed,
      save__walkProcessed,
      save__walkProcessedItem
    ]);
  } catch (error) {
    console.error(error);
  }
})();
