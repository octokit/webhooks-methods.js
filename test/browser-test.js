const { strictEqual } = require("assert");

const { readFile } = require("fs").promises;
const puppeteer = require("puppeteer");

runTests();

async function runTests() {
  const script = await readFile("pkg/dist-web/index.js", "utf-8");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("file:///");

  await page.addScriptTag({
    content: script.replace("export { sign, verify };", ""),
  });

  const [signature, verified] = await page.evaluate(async function () {
    const signature = await sign("secret", "data");
    console.log(signature);

    const verified = await verify("secret", "data", signature);
    console.log(verified);

    return [signature, verified];
  });

  strictEqual(
    signature,
    "sha256=1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db"
  );
  strictEqual(verified, true);

  await browser.close();

  console.log("All tests passed.");
}
