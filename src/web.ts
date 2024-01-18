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

async function importKey(secret: string) {
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/HmacImportParams
  return crypto.subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    enc.encode(secret),
    {
      // algorithm details
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    false, // export = false
    ["sign", "verify"], // what this key can do
  );
}

export async function sign(secret: string, payload: string) {
  if (!secret || !payload) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret & payload required for sign()",
    );
  }

  const signature = await crypto.subtle.sign(
    "HMAC",
    await importKey(secret),
    enc.encode(payload),
  );

  return `sha256=${UInt8ArrayToHex(signature)}`;
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

  return await crypto.subtle.verify(
    "HMAC",
    await importKey(secret),
    hexToUInt8Array(signature.replace(`sha256=`, "")),
    enc.encode(eventPayload),
  );
}
