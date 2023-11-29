export { sign, signSync } from "./node/sign";
import { verifySync } from "./node/verify";
export { verify, verifySync } from "./node/verify";

export async function verifyWithFallback(
  secret: string,
  payload: string,
  signature: string,
  additionalSecrets: undefined | string[],
): Promise<boolean> {
  return verifyWithFallbackSync(secret, payload, signature, additionalSecrets);
}

export function verifyWithFallbackSync(
  secret: string,
  payload: string,
  signature: string,
  additionalSecrets: undefined | string[],
): boolean {
  const firstPass = verifySync(secret, payload, signature);

  if (firstPass) {
    return true;
  }

  if (additionalSecrets !== undefined) {
    for (const s of additionalSecrets) {
      const v: boolean = verifySync(s, payload, signature);
      if (v) {
        return v;
      }
    }
  }

  return false;
}
