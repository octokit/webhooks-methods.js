import { randomBytes } from "node:crypto";
import { bench, describe } from "vitest";
import { uint8ArrayToHex as uint8ArrayToHexNode } from "../src/node/uint8array-to-hex.ts";
import { uint8ArrayToHex as uint8ArrayToHexWeb } from "../src/web/uint8array-to-hex.ts";

describe("uint8ArrayToHex", () => {
  const payload = randomBytes(1e3);

  bench("node", () => {
    uint8ArrayToHexNode(payload);
  });

  bench("web", () => {
    uint8ArrayToHexWeb(payload);
  });
});
