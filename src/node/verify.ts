import { timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

import { sign } from "./sign.js";
import { VERSION } from "../version.js";
import { getAlgorithm } from "../utils.js";

export async function verify(
  secret: string,
  eventPayload: string,
  signature: string,
): Promise<boolean> {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  }

  if (typeof eventPayload !== "string") {
    throw new TypeError(
      "[@octokit/webhooks-methods] eventPayload must be a string",
    );
  }

  const signatureBuffer = Buffer.from(signature);
  const algorithm = getAlgorithm(signature);

  const verificationBuffer = Buffer.from(
    await sign({ secret, algorithm }, eventPayload),
  );

  if (signatureBuffer.length !== verificationBuffer.length) {
    return false;
  }

  // constant time comparison to prevent timing attacks
  // https://stackoverflow.com/a/31096242/206879
  // https://en.wikipedia.org/wiki/Timing_attack
  return timingSafeEqual(signatureBuffer, verificationBuffer);
}

verify.VERSION = VERSION;
