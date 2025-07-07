import { uint8arrayToPrefixedSignatureString } from "../common/uint8array-to-signature.js";
import type { PrefixedSignatureString, Signer } from "../types.js";
import { VERSION } from "../version.js";

type SignerFactoryOptions = {
  hmacSha256: (
    key: Uint8Array,
    data: Uint8Array,
  ) => Uint8Array | Promise<Uint8Array>;
  stringToUint8Array: (input: string) => Uint8Array;
};

export function signFactory({
  hmacSha256,
  stringToUint8Array,
}: SignerFactoryOptions): Signer {
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

    const secretBuffer = stringToUint8Array(secret);
    const payloadBuffer = stringToUint8Array(payload);

    const signature = await hmacSha256(secretBuffer, payloadBuffer);

    return uint8arrayToPrefixedSignatureString(signature);
  };
  sign.VERSION = VERSION;
  return sign;
}
