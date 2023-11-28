import { Algorithm, type AlgorithmLike, type SignOptions } from "./types.js";
import { getAlgorithm } from "./utils.js";

const enc = new TextEncoder();

function hexToUInt8Array(string: string) {
  // convert string to pairs of 2 characters
  const pairs = string.match(/[\dA-F]{2}/gi) as RegExpMatchArray;

  // convert the octets to integers
  const integers = pairs.map(function (s) {
    return parseInt(s, 16);
  });

  return new Uint8Array(integers);
}

function UInt8ArrayToHex(signature: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(signature), (x) => x.toString(16).padStart(2, "0"))
    .join("");
}

function getHMACHashName(algorithm: AlgorithmLike) {
  return (
    {
      [Algorithm.SHA1]: "SHA-1",
      [Algorithm.SHA256]: "SHA-256",
    } as { [key in Algorithm]: string }
  )[algorithm];
}

async function importKey(secret: string, algorithm: AlgorithmLike) {
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/HmacImportParams
  return crypto.subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    enc.encode(secret),
    {
      // algorithm details
      name: "HMAC",
      hash: { name: getHMACHashName(algorithm) },
    },
    false, // export = false
    ["sign", "verify"], // what this key can do
  );
}

export async function sign(options: SignOptions | string, payload: string) {
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

  if (!Object.values(Algorithm).includes(algorithm as Algorithm)) {
    throw new TypeError(
      `[@octokit/webhooks] Algorithm ${algorithm} is not supported. Must be  'sha1' or 'sha256'`,
    );
  }

  const signature = await crypto.subtle.sign(
    "HMAC",
    await importKey(secret, algorithm),
    enc.encode(payload),
  );

  return `${algorithm}=${UInt8ArrayToHex(signature)}`;
}

export async function verify(
  secret: string,
  eventPayload: string,
  signature: string,
) {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required",
    );
  }

  const algorithm = getAlgorithm(signature);
  return await crypto.subtle.verify(
    "HMAC",
    await importKey(secret, algorithm),
    hexToUInt8Array(signature.replace(`${algorithm}=`, "")),
    enc.encode(eventPayload),
  );
}
