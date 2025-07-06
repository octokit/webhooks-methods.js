// constant time comparison to prevent timing attacks
// https://stackoverflow.com/a/31096242/206879
// https://en.wikipedia.org/wiki/Timing_attack
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  var len = a.length;
  var out = 0;
  var i = -1;
  while (++i < len) {
    out |= a[i] ^ b[i];
  }
  return out === 0;
}
