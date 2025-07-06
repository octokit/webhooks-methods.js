import { hash } from "node:crypto";

export function sha256(input: Uint8Array): Uint8Array {
  return hash("sha256", input, "buffer");
}
