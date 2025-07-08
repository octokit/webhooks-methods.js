import type { Verifier } from "../types.js";
import { isAsyncFunction } from "../common/is-async-function.js";
import { prefixedSignatureStringToUint8Array } from "../common/signature-to-uint8array.js";
import { isValidPrefixedSignatureString } from "../common/is-valid-signature.js";
import { VERSION } from "../version.js";

type VerifierFactoryOptions = {
  createKeyFromSecret: (secret: string) => any | Promise<any>;
  cryptoVerify(
    key: any,
    data: Uint8Array,
    signature: Uint8Array,
  ): boolean | Promise<boolean>;
  stringToUint8Array: (input: string) => Uint8Array;
};

export function verifyFactory({
  createKeyFromSecret,
  cryptoVerify,
  stringToUint8Array,
}: VerifierFactoryOptions): Verifier {
  const createKeyFromSecretIsAsync = isAsyncFunction(createKeyFromSecret);
  const cryptoVerifyIsAsync = isAsyncFunction(cryptoVerify);

  const verify: Verifier = async function verify(secret, payload, signature) {
    if (!secret || !payload || !signature) {
      throw new TypeError(
        "[@octokit/webhooks-methods] secret, payload & signature required",
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

    if (isValidPrefixedSignatureString(signature) === false) {
      return false;
    }

    const key = createKeyFromSecretIsAsync
      ? await createKeyFromSecret(secret)
      : createKeyFromSecret(secret);
    const signatureBuffer = prefixedSignatureStringToUint8Array(signature);

    return cryptoVerifyIsAsync
      ? ((await cryptoVerify(key, payloadBuffer, signatureBuffer)) as boolean)
      : (cryptoVerify(key, payloadBuffer, signatureBuffer) as boolean);
  };

  verify.VERSION = VERSION;
  return verify;
}
