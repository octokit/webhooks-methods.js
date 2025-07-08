import { randomBytes } from "node:crypto";
import { bench, describe } from "vitest";
import { uint8arrayToPrefixedSignatureString } from "../../src/common/uint8array-to-signature.ts";

describe("uint8arrayToPrefixedSignatureString", () => {
  const payload = randomBytes(32);

  bench("uint8arrayToPrefixedSignatureString", () => {
    uint8arrayToPrefixedSignatureString(payload);
  });
});
