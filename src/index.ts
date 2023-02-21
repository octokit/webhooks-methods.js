export { sign } from "./node/sign";
import { verify } from "./node/verify";
export { verify };

export async function verifyWithFallback(
  secret: string,
  payload: string,
  signature: string,
  additionalSecrets: undefined | string[]
): Promise<any> {
  const firstPass = await verify(secret, payload, signature);

  if (firstPass) {
    return true;
  }

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
