import { createHmac } from "node:crypto";
import { Algorithm, type SignOptions } from "../types.js";
import { VERSION } from "../version.js";

export async function sign(secret: string, payload: string): Promise<string>;
export async function sign(
  options: SignOptions,
  payload: string,
): Promise<string>;
export async function sign(
  options: SignOptions | string,
  payload: string,
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
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  }

  if (typeof payload !== "string") {
    throw new TypeError("[@octokit/webhooks-methods] payload must be a string");
  }

  if (!Object.values(Algorithm).includes(algorithm as Algorithm)) {
    throw new TypeError(
      `[@octokit/webhooks] Algorithm ${algorithm} is not supported. Must be 'sha256'`,
    );
  }

  return `${algorithm}=${createHmac(algorithm, secret)
    .update(payload)
    .digest("hex")}`;
}

sign.VERSION = VERSION;
