import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";
import { bench, describe } from "vitest";

describe("stringToUint8Array", () => {
  const payload = randomBytes(1e3).toString("utf-8");

  const bufferFrom = Buffer.from;

  bench("Buffer.from", () => {
    bufferFrom(payload);
  });

  const textEncoder = new TextEncoder();
  const encode = TextEncoder.prototype.encode.bind(textEncoder);

  bench("TextEncoder", () => {
    encode(payload);
  });
});
