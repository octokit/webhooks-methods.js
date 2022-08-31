import { sign, verify } from "../../src/web.ts";

import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";

Deno.test("sign", async () => {
  const actual = await sign("secret", "data");
  const expected =
    "1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db";
  assertEquals(actual, expected);
});

Deno.test("verify", async () => {
  const signature =
    "1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db";
  const actual = await verify("secret", "data", signature);
  const expected = true;
  assertEquals(actual, expected);
});
