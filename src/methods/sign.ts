import type { Signer } from "../types.js";
import { isAsyncFunction } from "../common/is-async-function.js";
import { uint8arrayToPrefixedSignatureString } from "../common/uint8array-to-signature.js";
import { VERSION } from "../version.js";

type SignerFactoryOptions = {
  createKeyFromSecret: (secret: string) => any | Promise<any>;
  hmacSha256: (key: any, data: Uint8Array) => Uint8Array | Promise<Uint8Array>;
  stringToUint8Array: (input: string) => Uint8Array;
};
export function signFactory({
  createKeyFromSecret,
  hmacSha256,
  stringToUint8Array,
}: SignerFactoryOptions): Signer {
  const createKeyFromSecretIsAsync = isAsyncFunction(createKeyFromSecret);
  const hmacSha256IsAsync = isAsyncFunction(hmacSha256);

  const sign: Signer = async function sign(secret, payload) {
    if (!secret || !payload) {
      throw new TypeError(
        "[@octokit/webhooks-methods] secret & payload required for sign()",
      );
    }

    let payloadBuffer: Uint8Array;

    if (typeof payload === "string") {
      payloadBuffer = stringToUint8Array(payload);
    } else if (payload instanceof Uint8Array) {
      payloadBuffer = payload;
    } else {
      throw new TypeError(
        "[@octokit/webhooks-methods] payload must be a string or Uint8Array",
      );
    }

    const key = createKeyFromSecretIsAsync
      ? await createKeyFromSecret(secret)
      : createKeyFromSecret(secret);

    const signature = hmacSha256IsAsync
      ? ((await hmacSha256(key, payloadBuffer)) as Uint8Array)
      : (hmacSha256(key, payloadBuffer) as Uint8Array);

    return uint8arrayToPrefixedSignatureString(signature);
  };
  sign.VERSION = VERSION;
  return sign;
}
