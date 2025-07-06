import { verifyFactory } from "./methods/verify.js";
import { verifyWithFallbackFactory } from "./methods/verify-with-fallback.js";
import { signFactory } from "./methods/sign.js";
import { VERSION } from "./version.js";

import { sha256 } from "./web/sha256.js";
import { timingSafeEqual } from "./web/timing-safe-equal.js";
import { uint8ArrayToHex } from "./web/uint8array-to-hex.js";

export const sign = signFactory({
  sha256,
  uint8ArrayToHex,
});
export const verify = verifyFactory({
  sign,
  timingSafeEqual,
});
export const verifyWithFallback = verifyWithFallbackFactory({ verify });
export { VERSION };
