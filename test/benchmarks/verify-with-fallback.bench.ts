import { bench, describe } from "vitest";
import { verifyWithFallback as verifyWithFallbackNode } from "../../src/index.ts";
import { verifyWithFallback as verifyWithFallbackWeb } from "../../src/web.ts";
import { toNormalizedJsonString } from "../common.ts";

describe("verifyWithFallback", () => {
  const eventPayload = toNormalizedJsonString({
    foo: "bar",
  });
  const bogus = "foo";
  const secret = "mysecret";
  const additionalSecrets = [secret];

  const signatureSHA256 =
    "sha256=e3eccac34c43c7dc1cbb905488b1b81347fcc700a7b025697a9d07862256023f";

  bench("node", async () => {
    await verifyWithFallbackNode(
      bogus,
      eventPayload,
      signatureSHA256,
      additionalSecrets,
    );
  });

  bench("web", async () => {
    await verifyWithFallbackWeb(
      bogus,
      eventPayload,
      signatureSHA256,
      additionalSecrets,
    );
  });
});
