import { timingSafeEqual } from "node:crypto";

import { hmacSha256 } from "./hmac-sha256.js";

export function cryptoVerify(
  key: Uint8Array,
  data: Uint8Array,
  signature: Uint8Array,
): boolean {
  return timingSafeEqual(signature, hmacSha256(key, data));
}
