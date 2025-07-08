import { createHmac } from "node:crypto";

export function hmacSha256(key: Uint8Array, data: Uint8Array): Uint8Array {
  return createHmac("sha256", key).update(data).digest();
}
