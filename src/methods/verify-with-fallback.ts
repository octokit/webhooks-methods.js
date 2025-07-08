import type { Verifier, VerifyWithFallback } from "../types.js";

export function verifyWithFallbackFactory({
  verify,
}: {
  verify: Verifier;
}): VerifyWithFallback {
  const verifyWithFallback = async function verifyWithFallback(
    secret: string,
    payload: string | Uint8Array,
    signature: string,
    additionalSecrets: undefined | string[],
  ): Promise<boolean> {
    const firstPass = await verify(secret, payload, signature);

    if (firstPass) {
      return true;
    }

    if (additionalSecrets !== undefined) {
      for (const s of additionalSecrets) {
        const v = await verify(s, payload, signature);
        if (v) {
          return v;
        }
      }
    }

    return false;
  };

  verifyWithFallback.VERSION = verify.VERSION;
  return verifyWithFallback;
}
