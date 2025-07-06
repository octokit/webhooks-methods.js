import { hmacSha256 } from "../common/hmac-sha256.js";
import { uint8arrayToSignature } from "../common/uint8array-to-signature.js";
import type { Signature, Signer } from "../types.js";
import { VERSION } from "../version.js";

type SignerFactoryOptions = {
  sha256: (data: Uint8Array) => Uint8Array | Promise<Uint8Array>;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function signFactory({ sha256 }: SignerFactoryOptions): Signer {
  const sign = async function sign(
    secret: string,
    payload: string,
  ): Promise<Signature> {
    if (!secret || !payload) {
      throw new TypeError(
        "[@octokit/webhooks-methods] secret & payload required for sign()",
      );
    }

    if (typeof payload !== "string") {
      throw new TypeError(
        "[@octokit/webhooks-methods] payload must be a string",
      );
    }

    const secretBuffer = textEncoder.encode(secret);

    const signature = await hmacSha256({
      data: textEncoder.encode(payload),
      key: secretBuffer,
      sha256,
    });

    return textDecoder.decode(uint8arrayToSignature(signature)) as Signature;
  };
  sign.VERSION = VERSION;
  return sign;
}
