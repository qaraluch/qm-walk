const test = require("ava");
const { walk, walkProcessed } = require("../index.js");

const testFixtures = "./test/fixtures/";
const testFixturesErr = testFixtures + "Err/";

test("walk is function", t => {
  const msg = "should be a function";
  const actual = typeof walk === "function";
  const expected = true;
  t.is(actual, expected, msg);
});

test("walkProcessed is function", t => {
  const msg = "should be a function";
  const actual = typeof walkProcessed === "function";
  const expected = true;
  t.is(actual, expected, msg);
});

test("return promise", async t => {
  const msg = "should return a promise";
  const actual = typeof (await walk().then) === "function";
  const expected = true;
  t.is(actual, expected, msg);
});

test("default", async t => {
  const files = await walk({ path: testFixtures });
  const msg = "should return array length greater than 0";
  const actual = files.length > 0;
  const expected = true;
  t.is(actual, expected, msg);
  const msg1 = "should return array of objects";
  const actual1 = files[0].constructor === Object;
  const expected1 = true;
  t.is(actual1, expected1, msg1);
  const msg2 = "should return object with path property witch is a string";
  const actual2 = typeof files[0].path === "string";
  const expected2 = true;
  t.is(actual2, expected2, msg2);
});

test("with stats", async t => {
  const files = await walk({ path: testFixtures });
  // console.log("files ", JSON.stringify(files));
  const msg2 = "should return object with stats property witch is a object";
  const actual2 = typeof files[0].stats === "object";
  const expected2 = true;
  t.is(actual2, expected2, msg2);
});

test("processed - remove cwd item", async t => {
  const [files, filesP] = await Promise.all([
    walk({ path: testFixtures }),
    walkProcessed({ path: testFixtures })
  ]);
  // console.log("files ", JSON.stringify(files));
  const msg2 = "should return array shorter by 1 item";
  const actual2 = files.length - filesP.length;
  const expected2 = 1;
  t.is(actual2, expected2, msg2);
});

test("processed - more properties", async t => {
  const files = await walkProcessed({ path: testFixtures });
  const item = files[3];
  const msg2 =
    "should item object has more properties: 'cwd', 'crown', 'parent', 'isFile', 'name'";
  const actual2 = item.hasOwnProperty("cwd");
  const actual3 = item.hasOwnProperty("crown");
  const actual4 = item.hasOwnProperty("parent");
  const actual5 = item.hasOwnProperty("isFile");
  const actual6 = item.hasOwnProperty("name");
  const actual7 = item.hasOwnProperty("ext");
  const expected = true;
  t.is(actual2, expected, msg2);
  t.is(actual3, expected, msg2);
  t.is(actual4, expected, msg2);
  t.is(actual5, expected, msg2);
  t.is(actual6, expected, msg2);
  t.is(actual7, expected, msg2);
});

test("error - custom wrapper", async t => {
  const msg = "should throw an error";
  const error = await t.throws(walk({ path: testFixturesErr }));
  t.is(
    error.message.slice(0, 34) + " ...",
    "Sth went wrong with 'walk' module: ...",
    msg
  );
});

test("filter out items - default", async t => {
  const files = await walkProcessed({
    path: "./"
  });
  const atoms = [].concat(...files.map(item => item.path.split("/")));
  const msg = "should return filter out 'node_modules' items";
  const actual = atoms.includes("node_modules");
  const expected = false;
  t.is(actual, expected, msg);
  const msg2 = "should return filter out '.git' items";
  const actual2 = atoms.includes(".git");
  const expected2 = false;
  t.is(actual, expected, msg);
});

test("filter out items", async t => {
  const files = await walkProcessed({
    path: testFixtures,
    filterOut: ["thread2"]
  });
  const atoms = [].concat(...files.map(item => item.path.split("/")));
  const msg = "should return filter out 'thread2' items";
  const actual = atoms.includes("thread2");
  const expected = false;
  t.is(actual, expected, msg);
});

// const tt = files.map(itm => itm.name);
// console.log("-->", tt);
