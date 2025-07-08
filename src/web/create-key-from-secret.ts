import { stringToUint8Array } from "./string-to-uint8array.js";

type CryptoKey = Awaited<ReturnType<typeof crypto.subtle.importKey>>;

export async function createKeyFromSecret(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw", // raw format of the key - should be Uint8Array
    stringToUint8Array(secret), // the key to import
    {
      // algorithm details
      name: "HMAC",
      hash: { name: "SHA-256" },
    },
    false, // export = false
    ["sign", "verify"], // what this key can do
  );
}
