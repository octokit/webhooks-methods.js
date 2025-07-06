import { Buffer } from "node:buffer";

export function uint8ArrayToHex(value: ArrayBufferLike): string {
  return Buffer.from(value).toString("hex");
}
