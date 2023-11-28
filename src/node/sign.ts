import { createHmac } from "crypto";
import { VERSION } from "../version";

export async function sign(
  secret: string | Buffer,
  payload: string,
): Promise<string> {
  if (!secret || !payload) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  }

  return `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
}

sign.VERSION = VERSION;
