import { bench, describe } from "vitest";
import { sign as signNode } from "../src";
import { sign as signWeb } from "../src/web";
import { toNormalizedJsonString } from "./common";

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
