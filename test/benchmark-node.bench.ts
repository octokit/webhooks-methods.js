import { bench, describe } from "vitest";
import { sign, verify } from "../src";
import { toNormalizedJsonString } from "./common";

describe("node", () => {
  const eventPayload = toNormalizedJsonString({
    foo: "bar",
  });
  const secret = "mysecret";

  const signatureSHA256 =
    "sha256=e3eccac34c43c7dc1cbb905488b1b81347fcc700a7b025697a9d07862256023f";
  bench("verify", async () => {
    await verify(secret, eventPayload, signatureSHA256);
  });

  bench("sign", async () => {
    await sign(secret, JSON.stringify(eventPayload));
  });
});
