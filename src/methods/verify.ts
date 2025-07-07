import { prefixedSignatureStringToUint8Array } from "../common/signature-to-uint8array.js";
import { verifyPrefixedSignatureString } from "../common/verify-signature.js";
import type { Verifier } from "../types.js";
import { VERSION } from "../version.js";

type VerifierFactoryOptions = {
  hmacSha256: (
    key: Uint8Array,
    data: Uint8Array,
  ) => Uint8Array | Promise<Uint8Array>;
  stringToUint8Array: (input: string) => Uint8Array;
  timingSafeEqual: (a: Uint8Array, b: Uint8Array) => boolean;
};

export function verifyFactory({
  hmacSha256,
  stringToUint8Array,
  timingSafeEqual,
}: VerifierFactoryOptions): Verifier {
  const verify: Verifier = async function verify(
    secret: string,
    eventPayload: string,
    signature: string,
  ): Promise<boolean> {
    if (!secret || !eventPayload || !signature) {
      throw new TypeError(
        "[@octokit/webhooks-methods] secret, eventPayload & signature required",
      );
    }

    if (typeof eventPayload !== "string") {
      throw new TypeError(
        "[@octokit/webhooks-methods] eventPayload must be a string",
      );
    }

    if (verifyPrefixedSignatureString(signature) === false) {
      return false;
    }

    const secretBuffer = stringToUint8Array(secret);
    const payloadBuffer = stringToUint8Array(eventPayload);
    const verificationBuffer = await hmacSha256(secretBuffer, payloadBuffer);
    const signatureBuffer = prefixedSignatureStringToUint8Array(signature);

    return timingSafeEqual(signatureBuffer, verificationBuffer);
  };

  verify.VERSION = VERSION;
  return verify;
}
