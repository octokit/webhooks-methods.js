import { bench, describe } from "vitest";
import { verify as verifyNode } from "../../src/index.ts";
import { verify as verifyWeb } from "../../src/web.ts";
import { toNormalizedJsonString } from "../common.ts";

describe("verify", async () => {
  const payload = toNormalizedJsonString({
    foo: "bar",
  });
  const secret = "mysecret";

  const signatureSHA256 =
    "sha256=4864d2759938a15468b5df9ade20bf161da9b4f737ea61794142f3484236bda3";

  bench("node", async () => {
    await verifyNode(secret, payload, signatureSHA256);
  });

  bench("web", async () => {
    await verifyWeb(secret, payload, signatureSHA256);
  });
});
