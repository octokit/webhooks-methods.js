import { createHmac } from "node:crypto";

import { bench, describe } from "vitest";
import { hmacSha256 as hmacSha256Node } from "../../src/node/hmac-sha256.ts";
import { hmacSha256 as hmacSha256Web } from "../../src/web/hmac-sha256.ts";

describe("hmacSha256", () => {
  const data = new TextEncoder().encode(
    JSON.stringify({
      foo: "bar",
    }),
  );
  const key = new TextEncoder().encode("mysecret");

  bench("node", async () => {
    hmacSha256Node(key, data);
  });

  bench("hmac native", () => {
    createHmac("sha256", key).update(data).digest();
  });

  bench("sha256 - web", async () => {
    await hmacSha256Web(key, data);
  });
});
