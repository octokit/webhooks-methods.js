import { createHmac } from "node:crypto";
import { VERSION } from "../version.js";

export async function sign(
  secret: string | Buffer,
  payload: string,
): Promise<string> {
  return signSync(secret, payload);
}

export function signSync(secret: string | Buffer, payload: string): string {
  if (!secret || !payload) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  }

  return `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
}

sign.VERSION = VERSION;
signSync.VERSION = VERSION;
