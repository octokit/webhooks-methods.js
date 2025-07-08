import { verifyFactory } from "./methods/verify.js";
import { verifyWithFallbackFactory } from "./methods/verify-with-fallback.js";
import { signFactory } from "./methods/sign.js";
import { VERSION } from "./version.js";

import { createKeyFromSecret } from "./web/create-key-from-secret.js";
import { cryptoVerify } from "./web/crypto-verify.js";
import { hmacSha256 } from "./web/hmac-sha256.js";
import { stringToUint8Array } from "./web/string-to-uint8array.js";

export const sign = signFactory({
  createKeyFromSecret,
  hmacSha256,
  stringToUint8Array,
});
export const verify = verifyFactory({
  createKeyFromSecret,
  cryptoVerify,
  stringToUint8Array,
});
export const verifyWithFallback = verifyWithFallbackFactory({ verify });
export { VERSION };
