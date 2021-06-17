import { createHmac } from "crypto";
import { VERSION } from "../version";

export enum Algorithm {
  SHA1 = "sha1",
  SHA256 = "sha256",
}

type SignOptions = {
  secret: string;
  algorithm?: Algorithm | "sha1" | "sha256";
};

export async function sign(
  options: SignOptions | string,
  payload: string
): Promise<string> {
  const { secret, algorithm } =
    typeof options === "object"
      ? {
          secret: options.secret,
          algorithm: options.algorithm || Algorithm.SHA256,
        }
      : { secret: options, algorithm: Algorithm.SHA256 };

  if (!secret || !payload) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret & payload required for sign()"
    );
  }

  if (!Object.values(Algorithm).includes(algorithm as Algorithm)) {
    throw new TypeError(
      `[@octokit/webhooks] Algorithm ${algorithm} is not supported. Must be  'sha1' or 'sha256'`
    );
  }

  return `${algorithm}=${createHmac(algorithm, secret)
    .update(payload)
    .digest("hex")}`;
}

sign.VERSION = VERSION;
