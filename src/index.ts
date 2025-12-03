export { sign } from "./node/sign.js";
import { verify } from "./node/verify.js";
export { verify };

export async function verifyWithFallback(
  secret: string,
  payload: string,
  signature: string,
  additionalSecrets: undefined | string[],
): Promise<any> {
  const firstPass = await verify(secret, payload, signature);

  if (firstPass) {
    return true;
  }

  /** v8 ignore else -- @preserve -- Bug with vitest where it thinks there is an else branch */
  if (additionalSecrets !== undefined) {
    for (const s of additionalSecrets) {
      const v: boolean = await verify(s, payload, signature);
      if (v) {
        return v;
      }
    }
  }

  return false;
}
