import { bench, describe } from "vitest";
import { verify as verifyNode } from "../src/index.ts";
import { verify as verifyWeb } from "../src/web.ts";
import { toNormalizedJsonString } from "./common.ts";

describe("sign", () => {
  const eventPayload = toNormalizedJsonString({
    foo: "bar",
  });
  const secret = "mysecret";

  bench("node", async () => {
    await signNode(secret, JSON.stringify(eventPayload));
  });

  bench("web", async () => {
    await signWeb(secret, JSON.stringify(eventPayload));
  });
});
