import { signatureStringToUint8Array } from "../common/signature-to-uint8array.js";
import { verifySignatureString } from "../common/verify-signature.js";
import type { Verifier } from "../types.js";
import { VERSION } from "../version.js";

type VerifierFactoryOptions = {
  hmacSha256: (
    key: Uint8Array,
    data: Uint8Array,
  ) => Uint8Array | Promise<Uint8Array>;
  timingSafeEqual: (a: Uint8Array, b: Uint8Array) => boolean;
};

const textEncoder = new TextEncoder();

export function verifyFactory({
  hmacSha256,
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

    if (verifySignatureString(signature) === false) {
      return false;
    }

    const signatureBuffer = signatureStringToUint8Array(signature);

    const secretBuffer = textEncoder.encode(secret);

    const verificationBuffer = await hmacSha256(
      secretBuffer,
      textEncoder.encode(eventPayload),
    );

    if (signatureBuffer.length !== verificationBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, verificationBuffer);
  };

  verify.VERSION = VERSION;
  return verify;
}
