import { bench, describe } from "vitest";
import { verify as verifyNode } from "../src/index.ts";
import { verify as verifyWeb } from "../src/web.ts";
import { toNormalizedJsonString } from "./common.ts";

describe("verify", () => {
  const eventPayload = toNormalizedJsonString({
    foo: "bar",
  });
  const secret = "mysecret";

  const signatureSHA256 =
    "sha256=e3eccac34c43c7dc1cbb905488b1b81347fcc700a7b025697a9d07862256023f";

  bench("node", async () => {
    await verifyNode(secret, eventPayload, signatureSHA256);
  });

  bench("web", async () => {
    await verifyWeb(secret, eventPayload, signatureSHA256);
  });
});
