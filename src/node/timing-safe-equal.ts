import { timingSafeEqual as cryptoTimingSafeEqual } from "node:crypto";

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return cryptoTimingSafeEqual(a, b);
}
