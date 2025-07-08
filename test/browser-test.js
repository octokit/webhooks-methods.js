import { strictEqual } from "node:assert";
import { readFile } from "node:fs/promises";

import puppeteer from "puppeteer";

runTests();

async function runTests() {
  console.log("Running browser tests...");

  const script = await readFile("pkg/dist-web/index.js", "utf-8");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("file:///");

  await page.addScriptTag({
    content: script
      .replace(
        `export {
  sign,
  verify
};`,
        "",
      )
      .replaceAll("export", ""),
  });

  const [signature, verified] = await page.evaluate(async function () {
    const signature = await sign("secret", "data");
    const verified = await verify("secret", "data", signature);
    return [signature, verified];
  });

  strictEqual(
    signature,
    "sha256=1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db",
  );
  strictEqual(verified, true);

  await browser.close();

  console.log("All browser tests passed.");
}
