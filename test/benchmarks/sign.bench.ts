import { bench, describe } from "vitest";
import { sign as signNode } from "../../src/index.ts";
import { sign as signWeb } from "../../src/web.ts";
import { toNormalizedJsonString } from "../common.ts";

describe("sign", () => {
  const payload = toNormalizedJsonString({
    foo: "bar",
  });
  const secret = "mysecret";

  bench("node", async () => {
    await signNode(secret, payload);
  });

  bench("web", async () => {
    await signWeb(secret, payload);
  });
});
