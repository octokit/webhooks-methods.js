import { hmacSha256 } from "../common/hmac-sha256.js";
import type { Signature, Signer } from "../types.js";
import { VERSION } from "../version.js";

type SignerFactoryOptions = {
  sha256: (data: Uint8Array) => Uint8Array | Promise<Uint8Array>;
  uint8ArrayToHex: (value: Uint8Array) => string;
};

const algorithm = "sha256";
const textEncoder = new TextEncoder();

export function signFactory({
  sha256,
  uint8ArrayToHex,
}: SignerFactoryOptions): Signer {
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

    return `${algorithm}=${uint8ArrayToHex(signature)}`;
  };
  sign.VERSION = VERSION;
  return sign;
}
