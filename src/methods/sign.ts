import { uint8arrayToPrefixedSignatureString } from "../common/uint8array-to-signature.js";
import type { PrefixedSignatureString, Signer } from "../types.js";
import { VERSION } from "../version.js";

type SignerFactoryOptions = {
  hmacSha256: (
    key: Uint8Array,
    data: Uint8Array,
  ) => Uint8Array | Promise<Uint8Array>;
};

const textEncoder = new TextEncoder();

export function signFactory({ hmacSha256 }: SignerFactoryOptions): Signer {
  const sign = async function sign(
    secret: string,
    payload: string,
  ): Promise<PrefixedSignatureString> {
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

    const signature = await hmacSha256(
      secretBuffer,
      textEncoder.encode(payload),
    );

    return uint8arrayToPrefixedSignatureString(signature);
  };
  sign.VERSION = VERSION;
  return sign;
}
