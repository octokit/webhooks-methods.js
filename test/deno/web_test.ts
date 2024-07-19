import { sign, verify } from "../../pkg/dist-web/index.js";

import { assertEquals } from "@std/assert";

Deno.test("sign", async () => {
  const actual = await sign("secret", "data");
  const expected =
  "sha256=1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db";
  assertEquals(actual, expected);
});

Deno.test("verify", async () => {
  const signature =
  "sha256=1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db";
  const actual = await verify("secret", "data", signature);
  const expected = true;
  assertEquals(actual, expected);
});
