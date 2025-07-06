import { verifySignature } from "../common/verify-signature.js";
import type { Signer, Verifier } from "../types.js";
import { VERSION } from "../version.js";

type VerifierFactoryOptions = {
  sign: Signer;
  timingSafeEqual: (a: Uint8Array, b: Uint8Array) => boolean;
};

const textEncoder = new TextEncoder();

export function verifyFactory({
  sign,
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

    if (verifySignature(signature) === false) {
      return false;
    }

    const signatureBuffer = textEncoder.encode(signature);
    const verificationBuffer = textEncoder.encode(
      await sign(secret, eventPayload),
    );

    if (signatureBuffer.length !== verificationBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, verificationBuffer);
  };

  verify.VERSION = VERSION;
  return verify;
}
