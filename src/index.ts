import { verifyFactory } from "./methods/verify.js";
import { verifyWithFallbackFactory } from "./methods/verify-with-fallback.js";
import { signFactory } from "./methods/sign.js";
import { VERSION } from "./version.js";

import { hmacSha256 } from "./node/hmac-sha256.js";
import { timingSafeEqual } from "./node/timing-safe-equal.js";

export const sign = signFactory({ hmacSha256 });
export const verify = verifyFactory({
  hmacSha256,
  timingSafeEqual,
});
export const verifyWithFallback = verifyWithFallbackFactory({ verify });
export { VERSION };
